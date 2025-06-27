import { FormattedCell } from '@/lib/excel-utils'
import ExcelJS from 'exceljs'
import * as XLSX from 'xlsx'
import { ColumnMapping } from './types'

/**
 * Checks if a string matches date format d/m/yyyy
 */
export const isDateFormat = (str: string): boolean => {
	if (!str) return false
	const datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/
	return datePattern.test(str)
}

/**
 * Format date to localized string
 */
export const formatDate = (dateString: string): string => {
	try {
		return new Date(dateString).toLocaleDateString('uk-UA')
	} catch (e) {
		return dateString
	}
}

/**
 * Detect date columns in data
 */
export const detectDateColumns = (
	headers: string[],
	rows: any[][]
): number[] => {
	const detectedDateColumns: number[] = []

	headers.forEach((_, index) => {
		const hasDateValues = rows.some(row => {
			const cellValue = row[index]?.toString()
			return isDateFormat(cellValue)
		})

		if (hasDateValues) {
			detectedDateColumns.push(index)
		}
	})

	return detectedDateColumns
}

/**
 * Map column titles with predefined mappings
 */
export const mapColumnTitles = (
	headers: string[],
	columnMappings: ColumnMapping[]
): Record<number, string> => {
	const columnTitles: Record<number, string> = {}

	columnMappings.forEach(mapping => {
		// Try exact matches first
		const exactMatchIndex = headers.findIndex(
			h =>
				h?.toString().toLowerCase() === mapping.key.toLowerCase() ||
				h?.toString().toLowerCase() === mapping.title.toLowerCase()
		)

		if (exactMatchIndex !== -1) {
			columnTitles[exactMatchIndex] = mapping.title
		} else {
			// Try partial matches
			const partialMatchIndex = headers.findIndex(
				h =>
					h?.toString().toLowerCase().includes(mapping.key.toLowerCase()) ||
					h?.toString().toLowerCase().includes(mapping.title.toLowerCase())
			)

			if (partialMatchIndex !== -1) {
				columnTitles[partialMatchIndex] = mapping.title
			}
		}
	})

	return columnTitles
}

/**
 * Process XLSX data from blob
 */
export const processXLSXData = async (
	blob: Blob
): Promise<{
	jsonData: any[][]
	headers: string[]
	dataRows: any[][]
	formattedData?: FormattedCell[][]
}> => {
	// Convert blob to array buffer
	const arrayBuffer = await blob.arrayBuffer()

	// Standard XLSX processing for data
	const workbook = XLSX.read(arrayBuffer, { type: 'array' })
	const sheetName = workbook.SheetNames[0]
	const worksheet = workbook.Sheets[sheetName]
	const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

	const headers = jsonData[0] as string[]
	const dataRows = jsonData.length > 1 ? jsonData.slice(1) : []

	// ExcelJS processing for formatting
	let formattedData: FormattedCell[][] = []
	try {
		const excelWorkbook = new ExcelJS.Workbook()
		await excelWorkbook.xlsx.load(arrayBuffer)

		const excelSheet = excelWorkbook.worksheets[0]

		// Skip header row (index 1)
		formattedData = []

		excelSheet.eachRow((row, rowNumber) => {
			// Skip header row
			if (rowNumber === 1) return

			const formattedRow: FormattedCell[] = []

			row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
				const formattedCell: FormattedCell = {
					value: cell.value?.toString() || null,
				}

				// Extract cell formatting
				if (cell.style) {
					formattedCell.style = {}

					// Background color - handle different fill types
					if (cell.fill && cell.fill.type === 'pattern') {
						// Safe type assertion since we checked the type
						const patternFill = cell.fill as ExcelJS.FillPattern
						if (patternFill.fgColor?.argb) {
							formattedCell.style.backgroundColor = `#${patternFill.fgColor.argb.substring(
								2
							)}`
						}
					}

					// Font formatting
					if (cell.font) {
						if (cell.font.color?.argb) {
							formattedCell.style.color = `#${cell.font.color.argb.substring(
								2
							)}`
						}
						formattedCell.style.bold = cell.font.bold || false
						formattedCell.style.italic = cell.font.italic || false
					}
				}

				formattedRow[colNumber - 1] = formattedCell
			})

			formattedData.push(formattedRow)
		})
	} catch (error) {
		console.error('Error extracting Excel formatting:', error)
		// Continue without formatting if there's an error
	}

	return { jsonData, headers, dataRows, formattedData }
}
