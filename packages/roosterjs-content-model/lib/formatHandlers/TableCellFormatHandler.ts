import { backgroundColorFormatHandler } from './common/backgroundColorFormatHandler';
import { borderFormatHandler } from './common/borderFormatHandler';
import { ContentModelTableCellFormat } from '../publicTypes/format/ContentModelTableCellFormat';
import { FormatHandler } from './FormatHandler';
import { sizeFormatHandler } from './common/sizeFormatHandler';
import { tableCellMetadataFormatHandler } from './table/tableCellMetadataFormatHandler';
import { textAlignFormatHandler } from './common/textAlignFormatHandler';
import { verticalAlignFormatHandler } from './common/verticalAlignFormatHandler';

/**
 * @internal
 */
export const TableCellFormatHandlers: FormatHandler<ContentModelTableCellFormat>[] = [
    sizeFormatHandler,
    borderFormatHandler,
    backgroundColorFormatHandler,
    textAlignFormatHandler,
    verticalAlignFormatHandler,
    tableCellMetadataFormatHandler,
];
