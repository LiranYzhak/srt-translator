import React from 'react';
import styles from './SubtitlePreview.module.css';

function SubtitlePreview({ content, isTranslated }) {
  const blocks = content.split('\n\n').slice(0, 5); // מציג 5 בלוקים ראשונים

  return (
    <div className={styles.previewContainer}>
      <h3>{isTranslated ? 'תצוגה מקדימה של התרגום:' : 'תצוגה מקדימה:'}</h3>
      <div className={styles.subtitleBlocks}>
        {blocks.map((block, index) => {
          const [number, timestamp, ...text] = block.split('\n');
          return (
            <div key={index} className={styles.block}>
              <div className={styles.number}>{number}</div>
              <div className={styles.timestamp}>{timestamp}</div>
              <div className={styles.text}>{text.join(' ')}</div>
            </div>
          );
        })}
      </div>
      {content.split('\n\n').length > 5 && (
        <div className={styles.more}>...ועוד {content.split('\n\n').length - 5} שורות</div>
      )}
    </div>
  );
}

export default SubtitlePreview; 