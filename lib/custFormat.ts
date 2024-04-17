let counter = 0;

export default function generateUniqueId (format: 'uuid' | 'sequential' = 'sequential'): string {
    if (format === 'uuid') {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    } else {
        return `id_${counter++}`;
    }
};
