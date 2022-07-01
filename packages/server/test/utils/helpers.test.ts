import { checkIfStringsArray, checkPropertyInEveryObjectsArray } from "@app/utils/helpers"

test('checkIfStringsArray - array of strings', () => {
  expect(checkIfStringsArray(
    ["A", "B", "C"]))
    .toEqual(true)
})

test('checkIfStringsArray - not array of strings', () => {
  expect(checkIfStringsArray(
    ["A", 12, "B"]))
    .toEqual(false)
})

test('checkPropertyInEveryObjectsArray - true case', () => {
  expect(checkPropertyInEveryObjectsArray([
    {
      "A": "valueA",
      "B": "valueB",
      "C": "valueC"
    },
    {
      "A": "valueA",
      "B": "valueB"
    },
    {
      "A": "valueA",
    }
  ], "A"))
    .toEqual(true)
})

test('checkPropertyInEveryObjectsArray - false case', () => {
  expect(checkPropertyInEveryObjectsArray([
    {
      "A": "valueA",
      "B": "valueB",
      "C": "valueC"
    },
    {
      "A": "valueA",
      "B": "valueB"
    },
    {
      "A": "valueA",
    }
  ], "B"))
    .toEqual(false)
})