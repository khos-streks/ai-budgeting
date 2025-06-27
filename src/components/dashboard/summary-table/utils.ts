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
}> => {
	// Convert blob to array buffer
	const arrayBuffer = await blob.arrayBuffer()

	const workbook = XLSX.read(arrayBuffer, { type: 'array' })
	const sheetName = workbook.SheetNames[0]
	const worksheet = workbook.Sheets[sheetName]
	const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

	const headers = jsonData[0] as string[]
	const dataRows = jsonData.length > 1 ? jsonData.slice(1) : []

	return { jsonData, headers, dataRows }
}
