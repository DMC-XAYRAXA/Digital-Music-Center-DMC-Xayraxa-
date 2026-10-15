/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * Official Microsoft Excel (.xls SpreadsheetML XML) & UTF-8 BOM CSV Report Generator
 * Supports Lao (ພາສາລາວ), Thai (ไทย), English, Vietnamese, Chinese, and Korean Unicode characters.
 */

export interface ExcelSheetData {
  sheetName: string;
  title: string;
  subtitle?: string;
  headers: string[];
  rows: (string | number)[][];
}

function escapeXml(val: string | number | null | undefined): string {
  const s = val === null || val === undefined ? '' : String(val);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function sanitizeSheetName(name: string): string {
  return name.replace(/[\\/?*[\]:]/g, '_').slice(0, 31) || 'Sheet1';
}

/**
 * Generates a native Microsoft Excel 2003+ XML Workbook (.xls) supporting multiple worksheets,
 * styled headers, borders, auto-width columns, and full UTF-8 Unicode (Lao / Thai / English).
 */
export function downloadExcelWorkbook(filename: string, sheets: ExcelSheetData[]): void {
  const timestamp = new Date().toLocaleString();

  const worksheetsXml = sheets
    .map((sheet) => {
      const safeName = escapeXml(sanitizeSheetName(sheet.sheetName));
      const colCount = Math.max(sheet.headers.length, 1);

      const columnsXml = sheet.headers
        .map((h) => {
          const width = Math.max(Math.min(h.length * 9 + 40, 260), 95);
          return `<Column ss:AutoFitWidth="1" ss:Width="${width}"/>`;
        })
        .join('\n        ');

      const headerCellsXml = sheet.headers
        .map(
          (h) =>
            `<Cell ss:StyleID="HeaderCell"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`
        )
        .join('');

      const rowsXml = sheet.rows
        .map((row, rowIdx) => {
          const styleId = rowIdx % 2 === 0 ? 'DataCellEven' : 'DataCellOdd';
          const cellsXml = row
            .map((cell) => {
              const isNum =
                typeof cell === 'number' && !Number.isNaN(cell) && Number.isFinite(cell);
              const dataType = isNum ? 'Number' : 'String';
              const cellStyle = isNum ? `${styleId}Num` : styleId;
              return `<Cell ss:StyleID="${cellStyle}"><Data ss:Type="${dataType}">${escapeXml(
                cell
              )}</Data></Cell>`;
            })
            .join('');
          return `        <Row ss:Height="22">${cellsXml}</Row>`;
        })
        .join('\n');

      return `  <Worksheet ss:Name="${safeName}">
    <Table ss:ExpandedColumnCount="${colCount}" ss:DefaultRowHeight="20">
        ${columnsXml}
        <Row ss:Height="28">
          <Cell ss:MergeAcross="${colCount - 1}" ss:StyleID="TitleBanner">
            <Data ss:Type="String">${escapeXml(sheet.title)}</Data>
          </Cell>
        </Row>
        <Row ss:Height="20">
          <Cell ss:MergeAcross="${colCount - 1}" ss:StyleID="SubtitleBanner">
            <Data ss:Type="String">${escapeXml(
              sheet.subtitle || `DMC Xayraxa Super App Rev 2.6 • Exported: ${timestamp}`
            )}</Data>
          </Cell>
        </Row>
        <Row ss:Height="26">${headerCellsXml}</Row>
${rowsXml}
    </Table>
  </Worksheet>`;
    })
    .join('\n');

  const workbookXml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Author>DMC Xayraxa Administrator Portal</Author>
    <Company>Digital Music Center (DMC Xayraxa) Lao PDR</Company>
    <Created>${new Date().toISOString()}</Created>
  </DocumentProperties>
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center"/>
      <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#111827"/>
    </Style>
    <Style ss:ID="TitleBanner">
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
      <Font ss:FontName="Calibri" ss:Size="14" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#7F0714" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="SubtitleBanner">
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
      <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#FDE68A"/>
      <Interior ss:Color="#1E293B" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="HeaderCell">
      <Alignment ss:Horizontal="Left" ss:Vertical="Center" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#D97706"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#334155"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#334155"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#334155"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#111827"/>
      <Interior ss:Color="#F59E0B" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="DataCellEven">
      <Alignment ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
      </Borders>
      <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="DataCellOdd">
      <Alignment ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
      </Borders>
      <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="DataCellEvenNum">
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
      </Borders>
      <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
      <NumberFormat ss:Format="#,##0"/>
    </Style>
    <Style ss:ID="DataCellOddNum">
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
      </Borders>
      <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
      <NumberFormat ss:Format="#,##0"/>
    </Style>
  </Styles>
${worksheetsXml}
</Workbook>`;

  const blob = new Blob(['\uFEFF' + workbookXml], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.xls') ? filename : `${filename}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates a UTF-8 with BOM (.csv) file that opens cleanly in Excel, Numbers, and Google Sheets.
 */
export function downloadCsvFile(filename: string, sheet: ExcelSheetData): void {
  const escapeCsvCell = (val: string | number): string => {
    const str = val === null || val === undefined ? '' : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [
    sheet.headers.map(escapeCsvCell).join(','),
    ...sheet.rows.map((row) => row.map(escapeCsvCell).join(',')),
  ];

  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
