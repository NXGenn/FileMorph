import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { FileText } from 'lucide-react';
import {
  convertTextEncoding,
  convertJsonToXml,
  convertXmlToJson,
  convertJsonToYaml,
  convertYamlToJson,
} from '../utils/text-converter';
import { TextFormat, Encoding } from '../types/conversion';

export const TextConverter: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceFormat, setSourceFormat] = useState<TextFormat>('json');
  const [targetFormat, setTargetFormat] = useState<TextFormat>('xml');
  const [sourceEncoding, setSourceEncoding] = useState<Encoding>('utf-8');
  const [targetEncoding, setTargetEncoding] = useState<Encoding>('ascii');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'format' | 'encoding'>('format');

  const handleConvert = async () => {
    if (!inputText) {
      setError('Please enter some text to convert');
      return;
    }

    setError(null);

    try {
      let result: string;

      if (mode === 'encoding') {
        result = await convertTextEncoding(inputText, sourceEncoding, targetEncoding);
      } else {
        switch (`${sourceFormat}-${targetFormat}`) {
          case 'json-xml':
            result = convertJsonToXml(inputText);
            break;
          case 'xml-json':
            result = convertXmlToJson(inputText);
            break;
          case 'json-yaml':
            result = convertJsonToYaml(inputText);
            break;
          case 'yaml-json':
            result = convertYamlToJson(inputText);
            break;
          default:
            throw new Error('Unsupported conversion');
        }
      }

      setOutputText(result);
    } catch (err) {
      console.error('Conversion failed:', err);
      setError(err instanceof Error ? err.message : 'Conversion failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Text Converter</h1>
        <p className="mt-2 text-gray-600">
          Convert between different text formats and encodings
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex space-x-4 justify-center">
          <Button
            variant={mode === 'format' ? 'primary' : 'secondary'}
            onClick={() => setMode('format')}
          >
            Format Conversion
          </Button>
          <Button
            variant={mode === 'encoding' ? 'primary' : 'secondary'}
            onClick={() => setMode('encoding')}
          >
            Encoding Conversion
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Input</h2>
              {mode === 'format' ? (
                <select
                  value={sourceFormat}
                  onChange={(e) => setSourceFormat(e.target.value as TextFormat)}
                  className="rounded-md border-gray-300"
                >
                  <option value="json">JSON</option>
                  <option value="xml">XML</option>
                  <option value="yaml">YAML</option>
                </select>
              ) : (
                <select
                  value={sourceEncoding}
                  onChange={(e) => setSourceEncoding(e.target.value as Encoding)}
                  className="rounded-md border-gray-300"
                >
                  <option value="utf-8">UTF-8</option>
                  <option value="ascii">ASCII</option>
                  <option value="iso-8859-1">ISO-8859-1</option>
                </select>
              )}
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-96 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter text to convert..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Output</h2>
              {mode === 'format' ? (
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value as TextFormat)}
                  className="rounded-md border-gray-300"
                >
                  <option value="json">JSON</option>
                  <option value="xml">XML</option>
                  <option value="yaml">YAML</option>
                </select>
              ) : (
                <select
                  value={targetEncoding}
                  onChange={(e) => setTargetEncoding(e.target.value as Encoding)}
                  className="rounded-md border-gray-300"
                >
                  <option value="utf-8">UTF-8</option>
                  <option value="ascii">ASCII</option>
                  <option value="iso-8859-1">ISO-8859-1</option>
                </select>
              )}
            </div>
            <textarea
              value={outputText}
              readOnly
              className="w-full h-96 rounded-md border-gray-300 bg-gray-50"
              placeholder="Converted text will appear here..."
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={handleConvert} className="w-full max-w-md">
            <FileText className="w-4 h-4 mr-2" />
            Convert Text
          </Button>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};