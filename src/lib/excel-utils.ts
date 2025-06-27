import ExcelJS from 'exceljs'

export interface FormattedCell {
	value: string | number | null
	style?: {
		backgroundColor?: string
		color?: string
		bold?: boolean
		italic?: boolean
	}
}

export interface FormattedExcelData {
	rows: FormattedCell[][]
	columns: string[]
}

/**
 * Extracts data from an Excel file with formatting preserved
 * @param file - Excel file (Buffer or ArrayBuffer)
 * @returns Promise with formatted data
 */
export async function parseExcelWithFormatting(
	file: ArrayBuffer
): Promise<FormattedExcelData> {
	const workbook = new ExcelJS.Workbook()
	await workbook.xlsx.load(file)

	const firstSheet = workbook.worksheets[0]
	const columns: string[] = []
	const formattedRows: FormattedCell[][] = []

	// Get column headers (assume first row contains headers)
	firstSheet.getRow(1).eachCell((cell, colNumber) => {
		columns.push(cell.value?.toString() || `Column ${colNumber}`)
	})

	// Process each row with formatting
	firstSheet.eachRow((row, rowNumber) => {
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

				// Background color
				if (cell.fill?.type === 'pattern' && cell.fill.pattern) {
					formattedCell.style.backgroundColor = `#${cell.fill.pattern}`
				}

				// Font formatting
				if (cell.font) {
					if (cell.font.color?.argb) {
						formattedCell.style.color = `#${cell.font.color.argb.substring(2)}`
					}
					formattedCell.style.bold = cell.font.bold
					formattedCell.style.italic = cell.font.italic
				}
			}

			formattedRow.push(formattedCell)
		})

		formattedRows.push(formattedRow)
	})

	return { rows: formattedRows, columns }
}

/**
 * Converts Excel file to formatted data structure
 * @param file - File object from file input
 * @returns Promise with formatted data
 */
export async function convertExcelFileToFormattedData(
	file: File
): Promise<FormattedExcelData> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.onload = async e => {
			try {
				if (e.target?.result instanceof ArrayBuffer) {
					const data = await parseExcelWithFormatting(e.target.result)
					resolve(data)
				} else {
					reject(new Error('Failed to read file as ArrayBuffer'))
				}
			} catch (error) {
				reject(error)
			}
		}

		reader.onerror = () => reject(new Error('Error reading file'))
		reader.readAsArrayBuffer(file)
	})
}
