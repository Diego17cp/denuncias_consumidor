import { useState, useEffect } from 'react';

export const useFileProgress = (files, maxSizeMB = 20) => {
    const [totalSize, setTotalSize] = useState(0);
    const [usedPercentage, setUsedPercentage] = useState(0);
    
    useEffect(() => {
        const sizeMB = files.reduce((acc, file) => acc + file.size / (1024 * 1024), 0);
        setTotalSize(sizeMB);
        setUsedPercentage((sizeMB / maxSizeMB) * 100);
    }, [files, maxSizeMB]);

    const getProgressColor = () => {
        if (usedPercentage > 90) return 'bg-red-500';
        if (usedPercentage > 70) return 'bg-yellow-500';
        return 'bg-blue-500';
    };

    const isLimitReached = totalSize >= maxSizeMB;

    return {
        totalSize,
        usedPercentage,
        isLimitReached,
        getProgressColor,
        maxSizeMB
    };
};