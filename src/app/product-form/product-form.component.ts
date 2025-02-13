import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../product.model';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEdit = false;
  productId!: number;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.maxLength(500)],
      stockQuantity: ['', [Validators.required, Validators.min(0)]],
      sku: ['', Validators.maxLength(50)],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: number) {
    this.productService.getProduct(id).subscribe(product => {
      this.productForm.patchValue(product);
    });
  }
  

  onSubmit() {
    if (this.productForm.valid) {
      const product: Product = {
        ...this.productForm.value,
        id: this.productId 
      };
      if (this.isEdit) {
        this.productService.updateProduct(this.productId, product).subscribe(() => {
          this.router.navigate(['/products']);
        });
      } else {
        this.productService.addProduct(product).subscribe(() => {
          this.router.navigate(['/products']);
        });
      }
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}