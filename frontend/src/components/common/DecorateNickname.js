import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DecoratedNickname = ({ nickname }) => {
    const [decorations, setDecorations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDecorations = async () => {
            try {
                const response = await axios.get(`http://15.165.163.233:9832/public/nickname-decoration/${nickname}`);
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
        let classes = [];
        let icons = [];

        decorations.forEach(decoration => {
            if (decoration.useFlag) {
                const decorationStyle = JSON.parse(decoration.style.style);

                Object.entries(decorationStyle).forEach(([key, value]) => {
                    if (key === 'previewContent') {
                        icons.push(value);
                    } else if (key === 'previewClass') {
                        classes.push(value);
                    } else {
                        style[key] = value;
                    }
                });
            }
        });

        return { style, classes: classes.join(' '), icons };
    };

    if (loading) {
        return <span className="text-gray-400">Loading...</span>;
    }

    const { style, classes, icons } = applyDecorations();

    const renderIcon = (icon, index) => {
        if (icon.startsWith('<svg')) {
            return <span key={index} dangerouslySetInnerHTML={{ __html: icon }} />;
        }
        return <span key={index}>{icon}</span>;
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span className={`decorated-nickname ${classes}`} style={{ ...style, display: 'flex', alignItems: 'center' }} title={nickname}>
                {icons.map((icon, index) => renderIcon(icon, index))}
                <span>{nickname}</span>
            </span>
        </div>
    );
};

export default DecoratedNickname;
