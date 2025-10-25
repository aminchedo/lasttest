// client/src/hooks/useDownloads.js
import { useEffect, useMemo, useState } from 'react';
import { subscribe, getState } from '../state/downloads';

export default function useDownloads(selector) {
    const [snap, setSnap] = useState(() => getState());

    useEffect(() => subscribe(setSnap), []);

    return useMemo(() => selector ? selector(snap) : snap, [snap, selector]);
}

