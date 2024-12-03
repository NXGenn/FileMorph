import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import yaml from 'js-yaml';
import iconv from 'iconv-lite';

export async function convertTextEncoding(
  text: string,
  sourceEncoding: string,
  targetEncoding: string
): Promise<string> {
  const buffer = iconv.encode(text, sourceEncoding);
  return iconv.decode(buffer, targetEncoding);
}

export function convertJsonToXml(jsonString: string): string {
  const jsonObj = JSON.parse(jsonString);
  const builder = new XMLBuilder();
  return builder.build(jsonObj);
}

export function convertXmlToJson(xmlString: string): string {
  const parser = new XMLParser();
  const jsonObj = parser.parse(xmlString);
  return JSON.stringify(jsonObj, null, 2);
}

export function convertJsonToYaml(jsonString: string): string {
  const jsonObj = JSON.parse(jsonString);
  return yaml.dump(jsonObj);
}

export function convertYamlToJson(yamlString: string): string {
  const jsonObj = yaml.load(yamlString);
  return JSON.stringify(jsonObj, null, 2);
}