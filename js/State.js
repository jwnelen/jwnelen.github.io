const state = {
  currView: CO2,
  selectedMunicipality: "",
  setNewMunicipality: () => {},
  update: () => {}
};

state.update = (newMun = null) => {
  state.getCurrentView().update(newMun)
}

state.setNewMunicipality = (newMun) => {
  state.selectedMunicipality = newMun;
  state.update(newMun)
  $('#mun-selection').val(newMun)
}

const newMunSelected = (event) => {
  state.setNewMunicipality(event.target.value)
}