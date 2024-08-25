import React, { useState, useEffect } from 'react';

const NicknameDecorationPreview = ({ selectedItems, initialNickname = "OLM" }) => {
    const [nickname, setNickname] = useState(initialNickname);

    useEffect(() => {
        setNickname(initialNickname);
    }, [initialNickname]);

    const applyDecorations = () => {
        let style = {};
        let classes = [];
        let icons = [];

        for (const item of selectedItems) {
            if (item.style) {
                Object.entries(item.style).forEach(([key, value]) => {
                    if (key === 'previewContent') {
                        icons.push(value);
                    } else if (key === 'previewClass') {
                        classes.push(value);
                    } else if (typeof value === 'object') {
                        style = { ...style, ...value };
                    } else {
                        style[key] = value;
                    }
                });
            }
        }

        return { style, classes: classes.join(' '), icons };
    };

    const renderIcon = (icon, index) => {
        if (icon.startsWith('<svg')) {
            // Parse the SVG string to modify its attributes
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(icon, 'image/svg+xml');
            const svgElement = svgDoc.documentElement;

            // Set width and height attributes
            svgElement.setAttribute('width', '20');
            svgElement.setAttribute('height', '20');

            // Convert back to string
            const modifiedSvg = new XMLSerializer().serializeToString(svgElement);

            return (
                <span
                    key={index}
                    className="icon-wrapper"
                    style={{
                        marginRight: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        width: '20px',
                        height: '20px'
                    }}
                    dangerouslySetInnerHTML={{ __html: modifiedSvg }}
                />
            );
        }
        return <span key={index} style={{ marginRight: '4px' }}>{icon}</span>;
    };

    const { style, classes, icons } = applyDecorations();

    return (
        <div className="p-4 bg-gray-800 rounded-lg">
            <div className="mb-4">
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-2">
                    닉네임
                </label>
                <input
                    type="text"
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-2 rounded-md w-full"
                />
            </div>

            <div className="mb-4">
                <h2 className="text-lg font-semibold text-white mb-2">미리보기</h2>
                <div className="bg-gray-700 p-4 rounded-lg flex justify-center items-center min-h-[40px]">
                    <span
                        className={`decorated-nickname ${classes}`}
                        style={{ ...style, display: 'inline-flex', alignItems: 'center' }}
                        title={nickname}
                    >
                        {icons.map((icon, index) => renderIcon(icon, index))}
                        <span>{nickname}</span>
                    </span>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold text-white mb-2">선택된 장식</h3>
                <ul className="list-disc list-inside text-gray-300">
                    {selectedItems.map((item, index) => (
                        <li key={index}>{item.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default NicknameDecorationPreview;