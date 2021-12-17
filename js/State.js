const state = {
  currView: INTRO,
  selectedMunicipality: "",
  setNewMunicipality: () => {},
  update: () => {},
  getCurrentView: () => {}
};

state.update = () => {
  state.getCurrentView().update(state.selectedMunicipality)
}

state.setNewMunicipality = (newMun) => {
  state.selectedMunicipality = newMun;
  $('#mun-selection').val(newMun)
}

state.newMunSelected = (event) => {
  state.setNewMunicipality(event.target.value)
}