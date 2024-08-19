import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DecoratedNickname = ({ nickname }) => {
    const [decorations, setDecorations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDecorations = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/public/nickname-decoration/${nickname}`);
                setDecorations(response.data);
            } catch (error) {
                console.error('Failed to fetch nickname decorations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDecorations();
    }, [nickname]);

    const applyDecorations = () => {
        let style = {};
        let classes = '';
        let icon = null;

        decorations.forEach(decoration => {
            const decorationStyle = JSON.parse(decoration.style);

            if (decorationStyle.previewClass) {
                classes += ` ${decorationStyle.previewClass}`;
            }

            if (decorationStyle.previewStyle) {
                style = { ...style, ...decorationStyle.previewStyle };
            }

            if (decorationStyle.previewContent) {
                icon = decorationStyle.previewContent;
            }
        });

        return { style, classes: classes.trim(), icon };
    };

    if (loading) {
        return <span className="text-gray-400">Loading...</span>;
    }

    const { style, classes, icon } = applyDecorations();

    return (
        <span className={`${classes} truncate`} style={style} title={nickname}>
            {icon && <span className="mr-1">{icon}</span>}
            {nickname}
        </span>
    );
};

export default DecoratedNickname;