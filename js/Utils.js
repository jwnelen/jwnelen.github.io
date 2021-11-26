const getMunicipalitiesBelowIncomeThreshold = (muns, val) => {
  return muns.filter((mun) => mun.income < val)
}

const getCO2FromMunicipalities = (co2, municipalities) => {
  return co2.filter(d => municipalities.includes(d.municipality))
}