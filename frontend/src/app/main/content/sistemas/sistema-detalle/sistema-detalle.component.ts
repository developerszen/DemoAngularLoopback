import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";

import { fuseAnimations } from "@fuse/animations";

import { ActivatedRoute } from "@angular/router";
import { SelectionModel } from "@angular/cdk/collections";
import {
  MatDialog,
  MatTableDataSource,
  MatSort,
  MatPaginator
} from "@angular/material";
import { SistemasService } from "../../../services/sistemas.service";
import { UsuarioSistemaService } from "../../../services/usuariosistema.service";
import { Usuario } from "../../../models/usuario.model";
import { UsuariosDialogComponent } from "./usuarios-modal/usuarios-modal.component";
import { FormGroup } from "@angular/forms";
import { Paginacion } from "../../../models/paginacion.model";

@Component({
  selector: "fuse-sistema-detalle",
  templateUrl: "./sistema-detalle.component.html",
  styleUrls: ["./sistema-detalle.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SistemaDetalleComponent implements OnInit {
  public paginacion: Paginacion;
  public usuarios: Usuario[];
  public displayedColumns = [
    "select",
    "id",
    "username",
    "nombres",
    "apellidos"
  ];
  public dataSource;
  public dialogRef;
  public selection = new SelectionModel<Usuario>(true, []);
  public cantDelete: number;
  public enableDelete: boolean;
  public sistema: string;
  public filterValue = "";

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private usuarioSistemaService: UsuarioSistemaService,
    private sistemaService: SistemasService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.paginacion = new Paginacion();
    this.enableDelete = false;
    this.cargarCabecera();
  }

  /**
   * cargarCabecera
   * * Carga la cabecera de la página
   */
  private cargarCabecera() {
    let data = {
      filtro: "",
      limit: 1,
      skip: 0,
      fk_sistema: this.route.snapshot.paramMap.get("id")
    };
    this.sistemaService.getSistemas(data, resp => {
      this.sistema = resp.data[0].sistema;
    });
  }

  ngOnInit() {
    this.listarUsuariosPorSistema();
  }
  /**
   * isAllSelected
   * * Verifica si todos los elementos fueron seleccionados
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /**
   * masterToggle
   * * Selecciona todas las filas si no estan seleccionadas
   * * caso contrario limpia la selección
   */
  public masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
 /**
  * onChangeMaster
  * * Evento que se lanza cuando se hace clic en el check de la 
  * * cabecera de la tabla
  * @param event 
  */
  public onChangeMaster(event) {
    this.masterToggle();
    this.enableDelete = this.selection.selected.length > 0;
    this.cantDelete = this.selection.selected.length;
  }
  /**
   * onChange
   * * Evento que se lanza cuando se hace click en el check de 
   * * una fila 
   * @param event 
   * @param row 
   */
  public onChange(event, row) {
    this.selection.toggle(row);
    this.enableDelete = this.selection.selected.length > 0;
    this.cantDelete = this.selection.selected.length;
  }

  /**
   * applyFilter
   * * Filtra la grilla de usuarios
   * @param filterValue
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  /**
   * listarUsuariosPorSistema
   * * Lista los usuarios por un sistema determinado
   */
  public listarUsuariosPorSistema() {
    var parametros = {
      fk_sistema: this.route.snapshot.paramMap.get("id")
    };

    this.usuarioSistemaService.getUsuariosInSistema(parametros, resp => {
      this.usuarios = resp;
      this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
      this.dataSource.paginator = this.paginator;
      this.paginacion.length = this.usuarios.length;
    });
  }

  /**
   * asignarUsuarios
   * * Abre el modal para asignar usuarios al sistema
   */
  public asignarUsuarios() {
    this.dialogRef = this.dialog.open(UsuariosDialogComponent, {
      panelClass: "contact-form-dialog",
      data: { fk_sistema: this.route.snapshot.paramMap.get("id") }
    });

    this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
      if (!response) {
        this.listarUsuariosPorSistema();
        return;
      }
    });
  }
}
