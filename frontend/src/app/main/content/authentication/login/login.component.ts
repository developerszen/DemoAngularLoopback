import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { FuseConfigService } from "@fuse/services/config.service";
import { Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { MatSnackBar } from "@angular/material";
import { AuthService } from "../../../services/auth.service";
import { TokenHelper } from "../../../helpers/token-helper";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  animations: fuseAnimations
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginFormErrors: any;
  error: boolean = false;
  isChecked = false;
  loading = false;
  color = 'primary'
  mode = 'indeterminate'
  disabledSubmit = false;

  constructor(
    private fuseConfig: FuseConfigService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {
    this.fuseConfig.setConfig({
      layout: {
        navigation: "none",
        toolbar: "none",
        footer: "none"
      }
    });

    this.loginFormErrors = {
      username: {},
      password: {}
    };
  }
  /**
   * ngOnInit
   * * Evento inicial del componente
   */
  public ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required, this.emailDomainValidator]],
      password: ["", Validators.required]
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.onLoginFormValuesChanged();
    });
  }
  /**
   * emailDomainValidator
   * * Valida cuando el usuario tiene dominio @pushup.com
   * @param control
   */
  public emailDomainValidator(control: FormControl) {
    let email = control.value;
    if (email && email.indexOf("@") != -1) {
      let [_, domain] = email.split("@");
      if (domain !== "pushup.com") {
        return {
          emailDomain: {
            parsedDomain: domain
          }
        };
      }
    }
    return null;
  }
  /**
   * onLoginFormValuesChanged
   * * Evento que se activa cada vez que hay cambio de valores en usuario y password
   * * Controla la validación de los campos
   */
  public onLoginFormValuesChanged() {
    if (!this.error) {
      for (const field in this.loginFormErrors) {
        if (!this.loginFormErrors.hasOwnProperty(field)) {
          continue;
        }
        this.loginFormErrors[field] = {};
        const control = this.loginForm.get(field);
        if (control && control.dirty && !control.valid) {
          this.loginFormErrors[field] = control.errors;
        }
      }
    }
  }
  /**
   * onChkChange
   * * Evento que contola la variable de recordar
   */
  public onChkChange() {
    this.isChecked = this.isChecked === true ? false : true;
  }
  /**
   * login
   * * Evento que loguea en base a usuario y password
   */
  public login() {
    this.loading = true;
    this.disabledSubmit = true
    let [_,domain] = this.loginForm.get("username").value.split("@")
    const postData = {
      username: _,
      password: this.loginForm.get("password").value,
      remember: this.isChecked
    };
    const publicIp = require('public-ip');
    publicIp.v4().then(ip =>{
      this.authService.login(postData, resp => {
        if (resp.code == 200) {
          this.error = false;
          this.authService.decodeToken(resp.data.token, dataToken => {
            const postData = {
              token: resp.data.token,
              fk_usuario: dataToken.obj.fk_usuario,
              fechacreacion: new Date(),
              habilitado: true,
              ip: ip
            };
            this.authService.registrarToken(postData, data => {
              TokenHelper.setToken(resp.data.token)
              this.loading = false; 
              this.disabledSubmit = false;
              this.router.navigateByUrl("/home");
            });
          });
        } else {
          this.loading = false;
          this.disabledSubmit = false;
          this.snackBar.open("Credenciales no validas", "Error!", {
            duration: 4000
          });
        }
      });
    });
  }
}
