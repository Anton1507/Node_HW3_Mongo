const mongoose=require('mongoose');
const contactShema=new mongoose.Schema({
    id:Number,
    name:String,
    email:String,
    phone:Number,
    surname:String,
    fathername:String

});
const Contacts = mongoose.model('Contacts',contactShema);






async function listContacts (){
     return await (Contacts.find({}))
                
}




async function removeContact(contactId){
    await Contacts.deleteOne({id:contactId})
     return {"message":"delete contact id="+`${contactId}`}

}
async function getContactById(contactId) {
    const contact = await Contacts.findOne({id:contactId})
    
    return contact
}

async function addContact(name, email, phone) {
    const contd = await (Contacts.find({}))
    const lastId = contd[contd.length-1].id;
    
    const newContact = await  Contacts.create({
        id:lastId +1 ,
        name:name,
        email:email,
        phone:phone})
   
    return newContact
  }


 async function updateContact (idIn,body){
    
     return await  Contacts.findOneAndUpdate({id:idIn},body,{new:true});
   
     

}










module.exports={listContacts,getContactById,removeContact,addContact,updateContact}