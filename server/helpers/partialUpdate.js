const sqlForPartialUpdate = (table, items, key, id) => {
  let idx = 1;
  let columns = [];

  for (let key in items) {
    if (key.startsWith("_")) {
      delete items[key];
    }
  }

  for (let column in items) {
    columns.push(`${column}=$${idx}`);
    idx += 1;
  }

  let cols = columns.join(", ");
  let query = `UPDATE ${table} SET ${cols}
                WHERE ${key}=$${idx}
                RETURNING *`;
  
  let values = Object.values(items);
  values.push(id);

  return { query, values };
}

module.exports = sqlForPartialUpdate;