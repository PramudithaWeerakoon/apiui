import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ProductService } from '../product.service';
import { Product } from '../product.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
  waveChart: any;
  isSidebarHidden: boolean = false;
  isDarkMode = false;
  
  

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) { }

  changeLanguage(language: string) {
    console.log(`Language changed to: ${language}`);
    this.translate.use(language);
  }

  ngOnInit(): void {
    this.loadProducts();
    const pieChartData = this.preparePieChartData(this.products);
    this.initializePieChart(pieChartData);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
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
    if (this.waveChart) {
      this.waveChart.destroy();
      this.waveChart = null;
    }
  }

  private loadProducts() {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.dataSource.data = this.products;
        this.updateCharts();
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

  private updateCharts() {
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

    if (this.waveChart) {
      this.waveChart.update({
        xAxis: { categories },
        series: [
          { type: 'line', name: 'Price', data: prices, color: '#007bff' },
          { type: 'line', name: 'Stock', data: stocks, color: '#28a745' }
        ]
      });
    } else {
      this.initializeWaveChart(categories, prices, stocks);
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

  private initializeWaveChart(categories: string[], prices: number[], stocks: number[]) {
    this.waveChart = Highcharts.chart({
      chart: {
        renderTo: 'waveChart',
        type: 'line',
        backgroundColor: '#f8f9fa'
      },
      title: {
        text: 'Product Trends',
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
          type: 'line',
          name: 'Price',
          data: prices,
          color: '#007bff'
        },
        {
          type: 'line',
          name: 'Stock',
          data: stocks,
          color: '#28a745'
        }
      ]
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private initializePieChart(data: { name: string, y: number }[]) {
    if (data.length === 0) {
      console.warn('No data available to display in the pie chart.');
      return;
    }
  
    Highcharts.chart('pieChart', {
      chart: {
        type: 'pie',
        backgroundColor: '#f8f9fa'
      },
      title: {
        text: 'Product Active Status'
      },
      series: [{
        type: 'pie',  // Ensuring the type is correctly set
        name: 'Products',
        data: data.map(item => ({ name: item.name, y: item.y, color: item.y > 0 ? '#28a745' : '#dc3545' })), // Adding color for better visualization
        allowPointSelect: true, // Allow selection
        cursor: 'pointer',
        showInLegend: true
      }]
    });
  }

  private preparePieChartData(products: any[]): { name: string, y: number }[] {
    const activeCount = products.filter(product => product.isActive).length;
    const inactiveCount = products.length - activeCount;
  
    return [
      { name: 'Active', y: activeCount },
      { name: 'Inactive', y: inactiveCount }
    ];
  }
  
  
}

