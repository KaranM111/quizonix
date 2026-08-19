document.addEventListener("DOMContentLoaded", () => {

    const sidebarItems = document.querySelectorAll(".sidebar ul li");

    sidebarItems.forEach(item => {

        item.addEventListener("click", () => {

            sidebarItems.forEach(i => i.classList.remove("active"));

            item.classList.add("active");

            const text = item.innerText.trim();

            switch(text){

                case "Logout":

                    if(confirm("Logout from Quizonix?")){

                        window.location.href="login.html";

                    }

                break;

            }

        });

    });

    const createUnitBtn=document.querySelectorAll(".panel button")[0];

    createUnitBtn.addEventListener("click",()=>{

        const unit=document.querySelectorAll(".panel input")[0].value;

        if(unit===""){

            alert("Enter Unit Name");

            return;

        }

        alert(unit+" Created Successfully.");

    });

    const createSubjectBtn=document.querySelectorAll(".panel button")[1];

    createSubjectBtn.addEventListener("click",()=>{

        const subject=document.querySelectorAll(".panel input")[1].value;

        if(subject===""){

            alert("Enter Subject Name");

            return;

        }

        alert(subject+" Added Successfully.");

    });

    const generateBtn=document.querySelectorAll(".panel button")[2];

    generateBtn.addEventListener("click",()=>{

        const progress=document.querySelector(".progress-bar");

        let width=0;

        generateBtn.disabled=true;

        generateBtn.innerHTML="Generating...";

        const interval=setInterval(()=>{

            width+=2;

            progress.style.width=width+"%";

            if(width>=100){

                clearInterval(interval);

                generateBtn.disabled=false;

                generateBtn.innerHTML="Generate MCQs";

                alert("MCQs Generated Successfully!");

            }

        },30);

    });

    const editBtns=document.querySelectorAll(".edit-btn");

    editBtns.forEach(btn=>{

        btn.addEventListener("click",()=>{

            alert("Edit functionality will be connected with backend.");

        });

    });

    const deleteBtns=document.querySelectorAll(".delete-btn");

    deleteBtns.forEach(btn=>{

        btn.addEventListener("click",()=>{

            if(confirm("Delete this record?")){

                btn.closest("tr").remove();

            }

        });

    });

});