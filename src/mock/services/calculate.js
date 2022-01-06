import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const name = ["4PX专线ARMX(A4)","泛欧挂号(ED)","4PX标准专线(A2)","4PX联邮通挂号(A6)","4PX-S小包挂号(B1)","DHL出口(A1)","中国EMS国际(C1)"]
const weightData = ["0-100G","101-250G","251-500G","501-750G","0-3KG"]
const sizeData = ["≤35×25×2.5CM","≤61×46×46CM"]
const dateNum = ["3-5","5-7","7-10"]

const calculate = (options) => {
  const queryParameters = getQueryParameters(options)
  const data = []
  for (let i = 0; i < queryParameters.count; i++) {
    const tmpKey = i + 1
    const num1 = parseInt(Math.random() * (7 - 0), 10)
    const num2 = parseInt(Math.random() * (5 - 0), 10)
    const num3 = parseInt(Math.random() * (2 - 0), 10)
    const num4 = parseInt(Math.random() * (3 - 0), 10)
    data.push({
      id: tmpKey,
      name: name[num1],
      weight: weightData[num2],
      fee: parseInt(Math.random() * 100 + 1),
      size: sizeData[num3],
      date: dateNum[num4],
    })
  }
  return builder({
    data: data,
    pages:{
      currentPage: 1,
      firstPage: 1,
      lastPage: 1,
      pageSize: 10
    }
  })
}

Mock.mock(/\/list\/calculate/, 'get', calculate)
