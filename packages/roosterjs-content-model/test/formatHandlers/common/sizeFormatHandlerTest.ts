import { ContentModelContext } from '../../../lib/publicTypes';
import { SizeFormat } from '../../../lib/publicTypes/format/formatParts/SizeFormat';
import { sizeFormatHandler } from '../../../lib/formatHandlers/common/sizeFormatHandler';

describe('sizeFormatHandler.parse', () => {
    let format: SizeFormat;
    let context: ContentModelContext;

    beforeEach(() => {
        format = {};
        context = {
            isDarkMode: false,
            zoomScale: 1,
            isRightToLeft: false,
        };
    });

    it('Not able to get size', () => {
        const fake = ({
            getBoundingClientRect: () => <any>null,
        } as any) as HTMLElement;
        sizeFormatHandler.parse(format, fake, context);
        expect(format).toEqual({});
    });

    it('Zero size', () => {
        const fake = ({
            getBoundingClientRect: () => ({
                width: 0,
                height: 0,
            }),
        } as any) as HTMLElement;
        sizeFormatHandler.parse(format, fake, context);
        expect(format).toEqual({});
    });

    it('Has size', () => {
        const fake = ({
            getBoundingClientRect: () => ({
                width: 10,
                height: 20,
            }),
        } as any) as HTMLElement;
        sizeFormatHandler.parse(format, fake, context);
        expect(format).toEqual({ width: 10, height: 20 });
    });

    it('UseBorderBox', () => {
        const fake = ({
            getBoundingClientRect: () => ({
                width: 0,
                height: 0,
            }),
            style: {
                boxSizing: 'border-box',
            },
        } as any) as HTMLElement;
        sizeFormatHandler.parse(format, fake, context);
        expect(format).toEqual({ useBorderBox: true });
    });
});

describe('sizeFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: SizeFormat;
    let context: ContentModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = {
            isDarkMode: false,
            zoomScale: 1,
            isRightToLeft: false,
        };
    });

    it('No size', () => {
        sizeFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Has width', () => {
        format.width = 10;
        sizeFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="width: 10px;"></div>');
    });

    it('Has height', () => {
        format.height = 20;
        sizeFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="height: 20px;"></div>');
    });

    it('Has both width and height', () => {
        format.width = 10;
        format.height = 20;
        sizeFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="width: 10px; height: 20px;"></div>');
    });

    it('UseBorderBox', () => {
        format.useBorderBox = true;
        sizeFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="box-sizing: border-box;"></div>');
    });
});
