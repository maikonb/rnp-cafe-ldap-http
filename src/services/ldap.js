const ldap = require('ldapjs');

var client = null; 

function initializeLdapClient() {
  client = ldap.createClient({
    url: process.env.LDAP_URL
  });
  client.bind(
    process.env.LDAP_DN, 
    process.env.LDAP_PASSWORD, 
    (err) => {
      if (null !== err) {
        console.error(err);
        throw new Error("Conexao com LDAP falhou. Verifique se as credenciais estao corretas e se o servidor está no ar.");
      }
      else
        console.log("Conexao com LDAP OK");
    }
  );
}

function getDataNascimento(user) {
  if (user.hasOwnProperty('data_nascimento')) {
    const regex = /\-/gi;
    let birth = user.data_nascimento;
    birth = birth.replace(regex,'');
    return birth;
  }
  return '19000101';
}

function getEntryFromUser(user) {
  const name = user.name.split(' ');
  var cn = name[0];
  var sn;
  if (name.length-1 >= 1)
    sn = name[ name.length-1 ];
  else      
    sn = "";
  let password = Buffer.from(user.password,'hex').toString('base64');
  const entry = {
    uid: user.login,
    schacCountryOfCitizenship: "Brazil",
    //brPersonPassport: "",
    telephoneNumber: user.celular,
    mail: user.email,
    cn: cn,
    sn: sn,
    objectClass: ["person","inetOrgPerson","brPerson","schacPersonalCharacteristics"],
    schacDateOfBirth: getDataNascimento(user),
    userPassword: `{MD5}${password}`,
    brPersonCPF: user.documento
  };
  return entry;
}

function affiliationType(perfil_id) {
  switch(perfil_id) {
    case 1: return 'faculty';
    case 2: return 'staff';
    case 3: return 'faculty';
    case 4: return 'other';
    case 5: return 'other';
    case 6: return 'student';
    default: return 'other';
  }
}

function getAffiliationFromUser(user) {
  const entry = {
    objectClass: "brEduPerson",
    brEduAffiliation: "1",
    brEduAffiliationType: affiliationType(user.perfil_id),
    brEntranceDate: "20200812"
  };
  return entry;
}

async function createUser(user) {
  if (null === client ) {
    console.log("LDAP nao conectado.");
    return false
  }

  let userEntry = getEntryFromUser(user);
  let userAffiliationEntry = getAffiliationFromUser(user);


  let resUserEntry = await new Promise((resolve) => {
    client.add(`uid=${userEntry.uid},ou=people,dc=ufr,dc=edu,dc=br`, userEntry, function(err) {
      if (err != null) {
        console.log(err);
        return resolve(false);
      }
      resolve(true);
    });
      
  });
  
  if (!resUserEntry)
    return false;
  
  let resAffiliationEntry = await new Promise((resolve) => {
    client.add(
      `brEduAffiliation=1,uid=${userEntry.uid},ou=people,dc=ufr,dc=edu,dc=br`, 
      userAffiliationEntry, function(err) { 
        if (err != null) {
          console.log(err);
          return resolve(false)
        }
        return resolve(true)
      }
    );      
  });
  return resAffiliationEntry;
}



async function createUser1(user) {
  if (null === client ) {
    console.log("LDAP nao conectado.");
    return Promise.resolve(false)
  }

  let userEntry = getEntryFromUser(user);
  let userAffiliationEntry = getAffiliationFromUser(user);

  client.add(`uid=${userEntry.uid},ou=people,dc=ufr,dc=edu,dc=br`, userEntry, function(err) {
    
    if (err != null) {
      console.log(err);
      return Promise.resolve(false);
    }
    
    client.add(
      `brEduAffiliation=1,uid=${userEntry.uid},ou=people,dc=ufr,dc=edu,dc=br`, 
      userAffiliationEntry, function(err) { 
        if (err != null) {
          console.log(err);
          return Promise.resolve(false)
        }

        console.log("OK");
        return Promise.resolve(true)

      }
    );
  });
  
}
module.exports = { initializeLdapClient, createUser }
