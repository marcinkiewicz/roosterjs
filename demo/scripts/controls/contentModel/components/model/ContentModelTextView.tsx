import * as React from 'react';
import { ContentModelText } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';
import { useProperty } from '../../hooks/useProperty';

const styles = require('./ContentModelTextView.scss');

export function ContentModelTextView(props: { text: ContentModelText }) {
    const { text } = props;
    const [value, setValue] = useProperty(text.text);

    const textArea = React.useRef<HTMLTextAreaElement>(null);
    const onChange = React.useCallback(() => {
        const newValue = textArea.current.value;
        text.text = newValue;
        setValue(newValue);
    }, [text, setValue]);

    const getContent = React.useCallback(() => {
        return <textarea ref={textArea} onChange={onChange} value={value} />;
    }, [text, value]);

    return (
        <ContentModelView
            title="Text"
            subTitle={value}
            className={styles.modelText}
            isSelected={text.isSelected}
            jsonSource={text}
            getContent={getContent}
        />
    );
}
