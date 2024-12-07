import React from 'react';
import { clsx } from 'clsx';
import { AudioFormat } from '../types/audio';

interface FormatSelectorAudioProps {
    selectedFormat: AudioFormat;
    onFormatChange: (format: AudioFormat) => void;
    disabled?: boolean;
}

const FORMATS: { value: AudioFormat; label: string }[] = [
    { value: 'mp3', label: 'MP3' },
    { value: 'wav', label: 'WAV' },
    { value: 'aac', label: 'AAC' },
    { value: 'flac', label: 'FLAC' },
    { value: 'ogg', label: 'OGG' }
];

export function FormatSelectorAudio({ selectedFormat, onFormatChange, disabled }: FormatSelectorAudioProps) {
    return (
        <div className="w-full">
            <label htmlFor="format" className="block text-sm font-medium text-gray-700">
                Output Format
            </label>
            <select
                id="format"
                value={selectedFormat}
                onChange={(e) => onFormatChange(e.target.value as AudioFormat)}
                disabled={disabled}
                className={clsx(
                    'mt-1 block w-full rounded-md border-gray-300 py-2 px-3',
                    'focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                    disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                )}
            >
                {FORMATS.map((format) => (
                    <option key={format.value} value={format.value}>
                        {format.label}
                    </option>
                ))}
            </select>
        </div>
    );
}