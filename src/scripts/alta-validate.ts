// Validaciones del alta online. La app las repite en el servidor (ver ALTA-ONLINE.md).

const DNI_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';

export const normalize = {
  taxId: (v: string) => v.replace(/[\s.-]/g, '').toUpperCase(),
  email: (v: string) => v.trim().toLowerCase(),
  // Sin espacios ni prefijo: 9 cifras.
  phone: (v: string) => v.replace(/[\s().-]/g, '').replace(/^(\+34|0034)/, ''),
};

/** NIF (DNI), NIE o CIF con su letra o dígito de control. */
export function isValidTaxId(raw: string): boolean {
  const v = normalize.taxId(raw);
  if (/^\d{8}[A-Z]$/.test(v)) return DNI_LETTERS[Number(v.slice(0, 8)) % 23] === v[8];
  if (/^[XYZ]\d{7}[A-Z]$/.test(v)) {
    const n = Number('XYZ'.indexOf(v[0]) + v.slice(1, 8));
    return DNI_LETTERS[n % 23] === v[8];
  }
  if (/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(v)) {
    const digits = v.slice(1, 8).split('').map(Number);
    let sum = 0;
    digits.forEach((d, i) => {
      if (i % 2 === 0) { const x = d * 2; sum += Math.floor(x / 10) + (x % 10); } else sum += d;
    });
    const control = (10 - (sum % 10)) % 10;
    return v[8] === String(control) || v[8] === 'JABCDEFGHI'[control];
  }
  return false;
}

const req = (msg: string) => (v: string) => (v ? '' : msg);

export const validators: Record<string, (v: string) => string> = {
  firstName: req('Escribe tu nombre.'),
  lastName: req('Escribe tus apellidos.'),
  email: (v) => {
    if (!v) return 'Escribe tu correo electrónico.';
    return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()) ? '' : 'Revisa el correo: parece que le falta algo (por ejemplo, «.es» o «.com»).';
  },
  phone: (v) => {
    if (!v) return 'Escribe tu móvil.';
    const p = normalize.phone(v);
    if (!/^\d{9}$/.test(p)) return 'El móvil debe tener 9 cifras, por ejemplo 600 123 456.';
    return /^[67]/.test(p) ? '' : 'Escribe un móvil: empieza por 6 o 7.';
  },
  businessName: req('Escribe el nombre de tu negocio.'),
  sector: req('Elige el sector de tu negocio.'),
  teamSize: req('Elige cuántas personas atienden.'),
  city: req('Escribe la ciudad.'),
  taxId: (v) => {
    if (!v) return 'Escribe tu NIF o CIF.';
    return isValidTaxId(v) ? '' : 'Este NIF no es válido. Revisa los números y la letra final.';
  },
  legalName: req('Escribe el nombre fiscal o la razón social.'),
  address: req('Escribe la dirección fiscal.'),
  postalCode: (v) => {
    if (!v) return 'Escribe el código postal.';
    const cp = v.trim();
    if (!/^\d{5}$/.test(cp)) return 'El código postal tiene 5 cifras, por ejemplo 28001.';
    return /^(0[1-9]|[1-4]\d|5[0-2])/.test(cp) ? '' : 'Este código postal no existe en España. Revisa las cifras.';
  },
  billCity: req('Escribe la población.'),
  province: req('Elige la provincia.'),
  terms: req('Para continuar, acepta las condiciones de contratación y la política de privacidad.'),
};
