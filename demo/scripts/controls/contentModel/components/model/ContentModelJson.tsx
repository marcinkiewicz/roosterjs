import * as React from 'react';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import {
    CompatibleContentModelBlockGroupType,
    CompatibleContentModelBlockType,
    CompatibleContentModelSegmentType,
} from 'roosterjs-content-model/lib/compatibleTypes';

const styles = require('./ContentModelJson.scss');

export function ContentModelJson(props: { jsonSource: Object }) {
    const { jsonSource } = props;
    const json = JSON.stringify(
        jsonSource,
        (key, value) => {
            if (safeInstanceOf(value, 'HTMLElement')) {
                return (
                    Object.prototype.toString.apply(value) +
                    ': ' +
                    (value.cloneNode() as HTMLElement).outerHTML
                );
            } else if (safeInstanceOf(value, 'Node')) {
                return Object.prototype.toString.apply(value);
            } else if (key == 'blockType') {
                return CompatibleContentModelBlockType[value];
            } else if (key == 'blockGroupType') {
                return CompatibleContentModelBlockGroupType[value];
            } else if (key == 'segmentType') {
                return CompatibleContentModelSegmentType[value];
            } else if (key == 'src' && typeof value == 'string') {
                return value.length > 100 ? value.substring(0, 97) + '...' : value;
            } else {
                return value;
            }
        },
        2
    );

    return <pre className={styles.json}>{json}</pre>;
}
