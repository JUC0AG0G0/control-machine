import React from "react";
import Header from "../../components/Header";

function ListMachines() {

  return (
    
    <div>
      <Header 
        title={`Liste des machines`}
        description={`Voici la liste des machines enregistré dans la base de donnée. Vous pouvez voir quelle sont les machines accessibles. Vous pouvez aussi en ajouter.`}
      />

    </div>

  );
}

export default ListMachines;
