export const customReducer = (data, component) => {
  console.log("\n=========CustomReducer");

  console.log(">", data, component);
  

  return data.filter(item => item['activities.type'] === 'B')
}