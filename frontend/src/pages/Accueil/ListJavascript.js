import React from "react";
import Header from "../../components/Header";

function ListJavascript() {

  return (
    
    <div className="p-4">
      <Header 
        title={`Liste des scripts javascript`}
        description={`Voici la liste des script enregistré dans la base de donnée. Vous pouvez les voir les modifié, vous pouvez aussi en ajouter.`}
      />

    </div>

  );
}

export default ListJavascript;
