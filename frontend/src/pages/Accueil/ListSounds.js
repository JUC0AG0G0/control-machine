import React from "react";
import Header from "../../components/Header";

function ListSounds() {

  return (
    
    <div>
      <Header 
        title={`Liste des sons`}
        description={`Voici la liste des sons enregistré dans la base de donnée. Vous pouvez les écouté ou en ajouter.`}
      />

    </div>

  );
}

export default ListSounds;
