import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Model: User
interface User {
  userId: number;
  nomeCompleto: string;
  dataNascimento: string;
  email: string;
  senha: string;
  estado: string;
  logradouro: string;
  numero: string;
}

function createEmptyUser(): User {
  return {
    userId: 0,
    nomeCompleto: '',
    dataNascimento: '',
    email: '',
    senha: '',
    estado: '',
    logradouro: '',
    numero: ''
  };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  isNewUser = true;
  userForm!: FormGroup;
  userList: User[] = [];
  localKey: string = 'angularUsers';
  
  // Lista de estados brasileiros
  estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm(): void {
    this.userForm = this.fb.group({
      userId: [0],
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      dataNascimento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      estado: ['', [Validators.required]],
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadUsersFromStorage();
  }

  loadUsersFromStorage(): void {
    const localData = localStorage.getItem(this.localKey);
    if (localData) {
      try {
        this.userList = JSON.parse(localData) as User[];
      } catch {
        this.userList = [];
      }
    }
  }

  changeView(): void {
    this.isNewUser = !this.isNewUser;
    if (this.isNewUser) {
      this.createForm();
    }
  }

  onEdit(data: User): void {
    this.userForm.patchValue(data);
    this.isNewUser = false;
  }

  onDelete(userId: number): void {
    const isDelete = confirm('Tem certeza que deseja excluir este registro?');
    if (isDelete) {
      const index = this.userList.findIndex((m) => m.userId === userId);
      if (index >= 0) {
        this.userList.splice(index, 1);
        this.storeData();
      }
    }
  }

  onUpdate(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value as User;
      const record = this.userList.find((m) => m.userId === formValue.userId);
      if (record) {
        Object.assign(record, formValue);
      }
      this.storeData();
      this.changeView();
    }
  }

  storeData(): void {
    localStorage.setItem(this.localKey, JSON.stringify(this.userList));
  }

  onSave(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value as User;
      // Atribuir um ID
      formValue.userId = this.userList.length > 0 ? Math.max(...this.userList.map(u => u.userId)) + 1 : 1;
      this.userList.push(formValue);
      this.storeData();
      this.createForm();
      this.changeView();
    }
  }

  get nomeCompleto() {
    return this.userForm.get('nomeCompleto');
  }

  get dataNascimento() {
    return this.userForm.get('dataNascimento');
  }

  get email() {
    return this.userForm.get('email');
  }

  get senha() {
    return this.userForm.get('senha');
  }

  get estado() {
    return this.userForm.get('estado');
  }

  get logradouro() {
    return this.userForm.get('logradouro');
  }

  get numero() {
    return this.userForm.get('numero');
  }
}
