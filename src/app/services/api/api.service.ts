import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, docData, Firestore, getDoc, getDocs, orderBy, OrderByDirection, query, setDoc, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private firestore: Firestore  
  ) { }

  docRef(path: string) {
    return doc(this.firestore, path);
  }

  collectionRef(path: string) {
    return collection(this.firestore, path);
  }

  setDocument(path: any, data: any) {
    const dataRef = this.docRef(path);
    return setDoc<any>(dataRef, data);
  }

  getDocById(path: string) {
    const dataRef = this.docRef(path);
    return getDoc(dataRef);
  }

  // Firestore 데이터베이스 내에서 지정된 경로에서 문서들을 가져오는 함수
  getDocs(path: string, queryFn?: any) {
    let dataRef: any = this.collectionRef(path);
    if (queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }
    return getDocs<any>(dataRef);
  }

  addDocuments(path: string, data: any) {
    const dataRef: any = this.collectionRef(path);
    return addDoc<any>(dataRef, data);
  }

  // Firebase Firestore의 collectionData() 메소드를 호출하여 
  // 해당 경로(path)의 컬렉션 데이터를 가져옵니다. 이때, 컬렉션 데이터 쿼리(query)를 전달할 수 있습니다.
  collectionDataQuery(path: any, queryFn?: any) {
    let dataRef: any = this.collectionRef(path);
    if(queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;    
    }
    const collection_data = collectionData<any> (dataRef, {idField: 'id'});

    return collection_data;  
  }

  // Firebase Firestore에서 제공하는 where() 메소드를 호출하여 컬렉션 데이터를 쿼리합니다. 
  // 이때, 필드 경로(filedPath), 조건(condition), 값을(value) 전달
  whereQuery(filedPath: any, condition: any, value: any) {
    return where(filedPath, condition, value);
  }

  orderByQuery(filedPath:any, directionStr: OrderByDirection = 'asc') {
    return orderBy(filedPath, directionStr);
  }

  docDataQuery(path: string, id?: boolean, queryFn?: any) {
    let dataRef: any = this.docRef(path);
    console.log('docDataQuery parameter is ', path, id, queryFn);
    // 쿼리 함수가 있는 경우 쿼리 수행
    if (queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }

    // 데이터 가져오기
    let doc_data: any;

    if(id) {
      // docData() 함수를 사용하여 데이터를 가져옵니다. 
      // docData() 함수는 데이터 참조와 옵션 정보를 인자로 받아서, 해당 문서의 데이터를 반환합니다. 
      // 이때, idField 옵션을 사용하여 문서의 ID 값을 가져올 수 있습니다.
      doc_data = docData<any>(dataRef, {idField: 'id'});

      return doc_data;

    } else {
      doc_data = docData<any>(dataRef);
      return doc_data;
    }
  }
}
