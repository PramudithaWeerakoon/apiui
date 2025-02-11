import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ProductService } from '../product.service';
import { Product } from '../product.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy, AfterViewInit {
  products: Product[] = [];
  dataSource = new MatTableDataSource<Product>();
  displayedColumns: string[] = ['name', 'price', 'stockQuantity', 'sku', 'isActive', 'actions'];
  chart: any;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  private loadProducts() {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.dataSource.data = this.products;
        this.updateChart();
      },
      (error) => console.error(error)
    );
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(
      () => this.loadProducts(),
      (error) => console.error(error)
    );
  }

  private updateChart() {
    const categories = this.products.map(p => p.name);
    const prices = this.products.map(p => p.price);
    const stocks = this.products.map(p => p.stockQuantity);

    if (this.chart) {
      this.chart.update({
        xAxis: { categories },
        series: [
          { type: 'column', name: 'Price', data: prices, color: '#007bff' },
          { type: 'column', name: 'Stock', data: stocks, color: '#28a745' }
        ]
      });
    } else {
      this.initializeChart(categories, prices, stocks);
    }
  }

  private initializeChart(categories: string[], prices: number[], stocks: number[]) {
    this.chart = Highcharts.chart({
      chart: {
        renderTo: 'productsChart',
        type: 'column',
        backgroundColor: '#f8f9fa'
      },
      title: {
        text: 'Product Overview',
        style: {
          color: '#333',
          fontWeight: 'bold'
        }
      },
      xAxis: {
        categories,
        crosshair: true,
        labels: {
          rotation: -45,
          style: {
            fontSize: '12px'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Values'
        }
      },
      series: [
        {
          type: 'column',
          name: 'Price',
          data: prices,
          color: 'Purple'
        },
        {
          type: 'column',
          name: 'Stock',
          data: stocks,
          color: 'Orange'
        }
      ]
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}