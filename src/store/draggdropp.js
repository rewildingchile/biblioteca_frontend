 
/* arreglo de objetos faena
[
  { id : 4, nombre:'', tipo: 0,posicion 0 },
 
]
*/

// dejar Droppables en []

const state = {
  Draggables: [],
  Droppables: [],
  idCurrentDrag: "",
  idCurrentDroppable:""
};
const getters = {
  getDraggables: (state) => {
    return state.Draggables;
  },
  getDroppables: (state) => {
   
      return state.Droppables;
   
  },
  getIdCurrentDroppable:(state) => {
    return state.idCurrentDroppable;
  }
};
const mutations = {
  draggableCreate(state, arrayObj) {
    state.Draggables = arrayObj
  },
  droppableCreate(state, arrayObj) {
    console.log('droppable');
    state.Droppables = arrayObj
  },
  draggableAdd(state, id) {
    state.Draggables.push({ id: id, pos: 0 });
  },
  draggableRemove(state, id) {
    const index = state.Draggables.findIndex((objeto) => objeto.id === id);
    if (index !== -1) {
      state.Draggables.splice(index, 1);
    }
  },
  droppableAdd(state) {
    console.log('droppableAdd',"<---")
    if(state.idCurrentDrag!==''){
      const objetoEncontrado = state.Draggables.find(faena => faena.id === state.idCurrentDrag);
      state.Droppables.push(objetoEncontrado );
      const index = state.Draggables.findIndex((faena) => faena.id ===state.idCurrentDrag);
      if (index !== -1) {
        state.Draggables.splice(index, 1);
      }
    }
    state.idCurrentDrag='';
  },
 
  setIdCurrentDrag(state,id){
    state.idCurrentDrag=id;
  },
  setIdCurrentDroppable(state,id){
    state.idCurrentDroppable=id;
  },
  setPosCurrentDroppable(state,id)
  {
  
   const indexCurrentDroppable= state.Droppables.findIndex(objeto => objeto.id === state.idCurrentDroppable)
   const index = state.Droppables.findIndex(objeto => objeto.id === id);

   console.log("arrastrado", indexCurrentDroppable)
   console.log("reemplazado", index)

   if (index !== -1) {
    const droppedItem = state.Droppables.splice(indexCurrentDroppable,1)[0]
    state.Droppables.splice(index, 0, droppedItem)
    
   } else {
     console.log(`No se encontró ningún objeto con id faena ${id}`);
   }



    
  },
  droppableUpdVisible(state,newobj)
  {
   
   console.log(' droppables ',state.Droppables);
   state.Droppables.forEach(faena => {
    if (faena.id === newobj.id) {
        faena.visible = newobj.visible;
        
    }
   });
    
 
    
  }
};

const actions = {
  draggableCreate(context, obj) {
    context.commit("draggableCreate", obj);
  },
  droppableCreate({ commit }, obj) {
    commit('droppableCreate', obj);
  },
  draggableRemove(context, idBuscado) {
    let indice = context.state.Draggables.findIndex(
      (objeto) => objeto.id === idBuscado
    );
    if (indice !== -1) {
      context.commit("draggableRemove", idBuscado);
    }
  },
  draggableAdd(context, id) {
    context.commit("draggableAdd", id);
  },
  droppableAdd(context, id) {
    context.commit("droppableAdd", id);
  },
  
  setIdCurrentDrag(context,id){
    context.commit("setIdCurrentDrag", id);
  },
  setIdCurrentDroppable(context,id){
    context.commit("setIdCurrentDroppable", id);
  },
  setPosCurrentDroppable(context, id){
    context.commit("setPosCurrentDroppable", id);
  },
  droppableUpdVisible(context, f){
    context.commit("droppableUpdVisible", f);
  }


};

export default {
  state,
  mutations,
  actions,
  getters
};
