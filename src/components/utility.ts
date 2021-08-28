const PASSWORD = 'admin';

export const createName = (name:string): string => {
  if (/_/.test(name)) {
    const newName = name.split('_');
    newName[0] = newName[0].charAt(0).toUpperCase() + newName[0].slice(1);
    newName[1] = `(set ${newName[1].toLocaleUpperCase()})`;
    return newName.join(' ');
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export function verifyForm(form: HTMLFormElement): void {
  if (form.login.value === PASSWORD && form.password.value === PASSWORD) {
    window.location.hash = '#admin';
  } else window.location.hash = '#main';
}
