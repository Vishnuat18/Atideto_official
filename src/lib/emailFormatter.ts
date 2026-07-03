export interface EmailResult {
  subject: string;
  html: string;
  text: string;
}

function fieldNameToLabel(name: string): string {
  let label = name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return label
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function isFileLike(value: any): boolean {
  if (typeof value !== 'object' || value === null) return false;
  return (
    (typeof File !== 'undefined' && value instanceof File) ||
    (typeof value.name === 'string' && typeof value.size === 'number')
  );
}

function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && !Array.isArray(value)) {
    if (isFileLike(value)) return false;
    if (Object.keys(value).length === 0) return true;
  }
  return false;
}

function formatValue(value: any): string {
  if (isEmpty(value)) return '';

  if (typeof value === 'string') {
    return value.replace(/\n/g, '<br>');
  }

  if (Array.isArray(value)) {
    const items = value.filter(item => !isEmpty(item));
    if (items.length === 0) return '';
    return items.map(item => formatValue(item)).join('<br>');
  }

  if (isFileLike(value)) {
    return value.name;
  }

  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value).filter(([_, v]) => !isEmpty(v));
    if (entries.length === 0) return '';
    return entries
      .map(([k, v]) => {
        const formatted = typeof v === 'string' ? v.replace(/\n/g, '<br>') : formatValue(v);
        return `${fieldNameToLabel(k)}: ${formatted}`;
      })
      .join('<br>');
  }

  return String(value);
}

function isNameField(key: string): boolean {
  const normalized = key.toLowerCase().replace(/[_-]/g, '');
  return normalized === 'name'
    || normalized === 'clientname'
    || normalized === 'fullname'
    || normalized === 'yourname';
}

function generateSubject(data: Record<string, any>): string {
  const nameField = Object.keys(data).find(key => isNameField(key));
  const nameValue = nameField ? data[nameField] : null;

  if (nameValue && typeof nameValue === 'string' && nameValue.trim()) {
    return `New Client Information Submission - ${nameValue.trim()}`;
  }

  return 'New Client Information Submission';
}

function generateHtmlBody(data: Record<string, any>): string {
  const entries = Object.entries(data).filter(([_, value]) => !isEmpty(value));

  if (entries.length === 0) {
    return `<p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0;">
  No client information was submitted.
</p>`;
  }

  const rows = entries.map(([key, value], index) => {
    const label = fieldNameToLabel(key);
    const formattedValue = formatValue(value);
    const bgColor = index % 2 === 0 ? '#f8f9fa' : '#ffffff';

    return `<tr style="background-color: ${bgColor};">
  <td style="padding: 12px 16px; border-bottom: 1px solid #e9ecef; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 700; color: #495057; width: 40%; vertical-align: top;">${label}</td>
  <td style="padding: 12px 16px; border-bottom: 1px solid #e9ecef; font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #212529; width: 60%; vertical-align: top;">${formattedValue}</td>
</tr>`;
  }).join('');

  return `<p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">
  A new client information form has been submitted. Please find the details below.
</p>

<table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; margin: 0;">
  <thead>
    <tr style="background-color: #5B5EFF;">
      <th style="padding: 12px 16px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 700; color: #ffffff; text-align: left;">Field</th>
      <th style="padding: 12px 16px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 700; color: #ffffff; text-align: left;">Value</th>
    </tr>
  </thead>
  <tbody>
    ${rows}
  </tbody>
</table>`;
}

function generateHtmlEmail(data: Record<string, any>): string {
  const bodyContent = generateHtmlBody(data);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f5; min-width: 100%;">
    <tr>
      <td align="center" style="padding: 40px 16px;">

        <table cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">

          <tr>
            <td style="padding: 32px 32px 24px 32px; background-color: #ffffff; border-bottom: 3px solid #5B5EFF;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-family: Arial, Helvetica, sans-serif;">
                    <h1 style="font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0 0 4px 0; line-height: 1.3;">New Client Information</h1>
                    <p style="font-size: 14px; color: #6b7280; margin: 0; line-height: 1.5;">A new project inquiry has been submitted through the Client Connect form.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px;">
              ${bodyContent}
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 32px; background-color: #f8f9fa; border-top: 1px solid #e9ecef;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.6;">
                    <p style="margin: 0 0 8px 0; font-weight: 600; color: #6b7280;">ATIDETO</p>
                    <p style="margin: 0;">This is an automatically generated email from the application.<br>Please do not reply to this email.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <table cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; margin-top: 16px;">
          <tr>
            <td style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #9ca3af; text-align: center; line-height: 1.6; padding: 0 16px;">
              &copy; ${new Date().getFullYear()} ATIDETO. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

function generateTextBody(data: Record<string, any>): string {
  const entries = Object.entries(data).filter(([_, value]) => !isEmpty(value));

  if (entries.length === 0) {
    return 'No client information was submitted.';
  }

  const lines = entries.map(([key, value]) => {
    const label = fieldNameToLabel(key);

    let formattedValue: string;
    if (typeof value === 'string') {
      formattedValue = value;
    } else if (Array.isArray(value)) {
      const items = value.filter(v => !isEmpty(v));
      formattedValue = items.join(', ');
    } else if (isFileLike(value)) {
      formattedValue = value.name;
    } else if (typeof value === 'object' && value !== null) {
      const subEntries = Object.entries(value).filter(([_, v]) => !isEmpty(v));
      formattedValue = subEntries.length > 0
        ? '\n' + subEntries.map(([k, v]) => `  ${fieldNameToLabel(k)}: ${v}`).join('\n')
        : '';
    } else {
      formattedValue = String(value);
    }

    return `${label}: ${formattedValue}`;
  });

  const intro = 'A new client information form has been submitted. Please find the details below.\n';
  const footer = '\n--\nATIDETO\nThis is an automatically generated email from the application.';

  return `${intro}\n${lines.join('\n')}\n${footer}`;
}

export function formatClientEmail(data: Record<string, any>): EmailResult {
  const subject = generateSubject(data);
  const html = generateHtmlEmail(data);
  const text = generateTextBody(data);
  return { subject, html, text };
}
