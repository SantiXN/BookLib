import * as React from 'react';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import type { ToolbarProps, ToolbarSlot, TransformToolbarSlot } from '@react-pdf-viewer/toolbar';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { zoomPlugin } from '@react-pdf-viewer/zoom';

interface RemovePartsDefaultToolbarDefaultLayoutExampleProps {
    fileUrl: string;
}

const CustomViewer: React.FC<RemovePartsDefaultToolbarDefaultLayoutExampleProps> = ({
    fileUrl,
}) => {
    const zoomPluginInstance = zoomPlugin();

    const { zoomTo } = zoomPluginInstance;

    // Устанавливаем масштаб при загрузке
    React.useEffect(() => {
        // Установим масштаб в 150% при монтировании компонента
        zoomTo(1.3);
    }, [zoomTo]);

    const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
        ...slot,
        Download: () => <></>,
        DownloadMenuItem: () => <></>,
        Open: () => <></>,
        Print: () => <></>,
    });

    const renderToolbar = (Toolbar: (props: ToolbarProps) => React.ReactElement) => (
        <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
    );
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar,
        sidebarTabs: () => []
    });
    const { renderDefaultToolbar } = defaultLayoutPluginInstance.toolbarPluginInstance;

    return <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance, zoomPluginInstance]} />;
};

export default CustomViewer;