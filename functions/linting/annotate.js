module.exports = (code, errors) => {
  let final = '';

  for (const error of errors) {
    const line = code.split('\n')[error.line - 1];
    const annotation = `${' '.repeat(error.column - 1)}^ `;
    const reason = `[${error.line}:${error.column}] ${error.message}`;
    final = `${final}${line}\n${annotation}\n${reason}`;
  }

  return final;
};
