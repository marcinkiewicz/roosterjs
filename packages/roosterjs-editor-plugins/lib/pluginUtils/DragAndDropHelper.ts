import Disposable from './Disposable';
import DragAndDropHandler from './DragAndDropHandler';
import { Browser } from 'roosterjs-editor-dom';

/**
 * @internal
 * Compatible mouse event names for different platform
 */
interface MouseEventInfo {
    MOUSEDOWN: string;
    MOUSEMOVE: string;
    MOUSEUP: string;
    getPageXY: (e: Event) => number[];
}

/**
 * Generate event names and getXY function based on different platforms to be compatible with desktop and mobile browsers
 */
const MOUSE_EVENT_INFO: MouseEventInfo = (() => {
    if (Browser.isMobileOrTablet) {
        return {
            MOUSEDOWN: 'touchstart',
            MOUSEMOVE: 'touchmove',
            MOUSEUP: 'touchend',
            getPageXY: getTouchEventPageXY,
        };
    } else {
        return {
            MOUSEDOWN: 'mousedown',
            MOUSEMOVE: 'mousemove',
            MOUSEUP: 'mouseup',
            getPageXY: getMouseEventPageXY,
        };
    }
})();

function getMouseEventPageXY(e: MouseEvent): [number, number] {
    return [e.pageX, e.pageY];
}

function getTouchEventPageXY(e: TouchEvent): [number, number] {
    let pageX = 0;
    let pageY = 0;
    if (e.targetTouches && e.targetTouches.length > 0) {
        const touch = e.targetTouches[0];
        pageX = touch.pageX;
        pageY = touch.pageY;
    }
    return [pageX, pageY];
}

/**
 * @internal
 * A helper class to help manage drag and drop to an HTML element
 */
export default class DragAndDropHelper<TContext, TInitValue> implements Disposable {
    private initX: number;
    private initY: number;
    private initValue: TInitValue;

    /**
     * Create a new instance of DragAndDropHelper class
     * @param trigger The trigger element. When user start drag on this element,
     * events will be fired to the handler object
     * @param context Context object that will be passed to handler function when event is fired,
     * so that the handler object knows which element it is triggered from.
     * @param onSubmit A callback that will be invoked when event handler in handler object returns true
     * @param handler The event handler object, see DragAndDropHandler interface for more information
     */
    constructor(
        private trigger: HTMLElement,
        private context: TContext,
        private onSubmit: (context: TContext, trigger: HTMLElement) => void,
        private handler: DragAndDropHandler<TContext, TInitValue>,
        private zoomScale: number
    ) {
        trigger.addEventListener(MOUSE_EVENT_INFO.MOUSEDOWN, this.onMouseDown);
    }

    /**
     * Dispose this object, remove all event listeners that has been attached
     */
    dispose() {
        this.trigger.removeEventListener(MOUSE_EVENT_INFO.MOUSEDOWN, this.onMouseDown);
        this.removeDocumentEvents();
    }

    private addDocumentEvents() {
        const doc = this.trigger.ownerDocument;
        doc.addEventListener(MOUSE_EVENT_INFO.MOUSEMOVE, this.onMouseMove, true /*useCapture*/);
        doc.addEventListener(MOUSE_EVENT_INFO.MOUSEUP, this.onMouseUp, true /*useCapture*/);
    }

    private removeDocumentEvents() {
        const doc = this.trigger.ownerDocument;
        doc.removeEventListener(MOUSE_EVENT_INFO.MOUSEMOVE, this.onMouseMove, true /*useCapture*/);
        doc.removeEventListener(MOUSE_EVENT_INFO.MOUSEUP, this.onMouseUp, true /*useCapture*/);
    }

    private onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.addDocumentEvents();
        [this.initX, this.initY] = MOUSE_EVENT_INFO.getPageXY(e);
        this.initValue = this.handler.onDragStart?.(this.context, e);
    };

    private onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        const [pageX, pageY] = MOUSE_EVENT_INFO.getPageXY(e);
        const deltaX = (pageX - this.initX) / this.zoomScale;
        const deltaY = (pageY - this.initY) / this.zoomScale;
        if (this.handler.onDragging?.(this.context, e, this.initValue, deltaX, deltaY)) {
            this.onSubmit?.(this.context, this.trigger);
        }
    };

    private onMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        this.removeDocumentEvents();

        if (this.handler.onDragEnd?.(this.context, e, this.initValue)) {
            this.onSubmit?.(this.context, this.trigger);
        }
    };
}
