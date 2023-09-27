import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { LoginService } from 'src/app/logic/services/login.service';
import { User } from 'src/app/logic/models/user-model/user-model.component';
import { ToastrService } from 'ngx-toastr';

//min 8 characters capital special character
@Component({
  selector: 'az-login',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {  
    public router: Router;
    public form: FormGroup;
    public email: FormControl;
    public password: FormControl;
    private _loginService: LoginService;
    private userModel: User = { email: '', password: ''};

    constructor(router: Router, fb: FormBuilder, private loginService:LoginService, private toastr: ToastrService) {
        this.router = router;
        this.form = fb.group({
            'email': ['', Validators.compose([Validators.required, Validators.email])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(8)])]
        });

        this.email = this.form.controls['email'] as FormControl;;
        this.password = this.form.controls['password'] as FormControl;;
        this._loginService = loginService;
    }

    ngOnInit() {
        if(localStorage.getItem("role")){
            localStorage.removeItem('role');
        }
    }
    

    public async onSubmit(values:Object):Promise<void> {
        //console.log(values);
        if (this.form.valid) {
            if(this.form.getRawValue() != null){
                const temp = this.form.getRawValue();
                if(temp.email != null){
                    this.userModel.email = temp.email;
                }
                if(temp.password != null){
                    this.userModel.password = temp.password;
                }                
            }
            //this.toastr.error("Error Logging In");
            await this._loginService.signIn(this.userModel)
                    .toPromise();
            
            //console.log(this.userModel);
            
            //this.router.navigate(['pages/dashboard']);
        }
    }
}

