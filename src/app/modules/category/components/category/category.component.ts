import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit{
  constructor(private categoryService: CategoryService,
    public dialog: MatDialog, private snackBar: MatSnackBar,
    ){

  }
  //metodo de carga
  ngOnInit(): void {
    this.getCategories();
  }

  displayedColumns: string[] = ["id", "name", "description", "actions"]
  dataSource = new MatTableDataSource<CategoryElement>();
  getCategories(){
    this.categoryService.getCategories()
    .subscribe((data: any)=>{
      //  console.log("recivido", data)
        this.processCategoriesResponse(data)
    }, (error: any)=>{
        console.error(error)
    })
  }
  
  processCategoriesResponse(resp: any){
    const dataCategory: CategoryElement[] = []
    if(resp.metadata[0].code == "00"){
      let listCategory = resp.categoryResponse.category
      
      listCategory.forEach((element: CategoryElement) => {
            console.log(element)
            dataCategory.push(element)
            console.log("introdujo")
      });
      console.log("antes de introducir")
      this.dataSource=new MatTableDataSource<CategoryElement>(dataCategory)
      console.log("despues de introducir")
    }
   // console.log(this.dataSource)

  }
  openCategoryDialog(){
    const dialogRef = this.dialog.open(NewCategoryComponent,{
      width: '450px'
    });
    dialogRef.afterClosed().subscribe((result:any)=>{
      if(result == 1){
        this.openSnackBar("Categoría agregada", "Exitosa")
        this.getCategories()
      }else if(result ==2){
        this.openSnackBar("Se produjo un error al guardar la categoría", "Error")
      }
    })
  }
  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar>{
      return this.snackBar.open(message, action, {
        duration: 2000
      })
  }
  edit(id:number, name:string, description: string){
    const dialogRef = this.dialog.open(NewCategoryComponent,{
      width: '450px',
      data: {id: id, name: name, description: description}
    });
    dialogRef.afterClosed().subscribe((result:any)=>{
      if(result == 1){
        this.openSnackBar("Categoría agregada", "Exitosa")
        this.getCategories()
      }else if(result ==2){
        this.openSnackBar("Se produjo un error al guardar la categoría", "Error")
      }
    })
  }

}
export interface CategoryElement{
      name: string;
      description: string;
      id: number;
}