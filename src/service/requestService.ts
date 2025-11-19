import { api } from './api';

export interface EstateRequest {
  id: string;
  userId: string;
  propertyType: string;
  location: string;
  budget: string;
  bedrooms?: string;
  bathrooms?: string;
  surface?: string;
  district?: string;
  additionalRequirements?: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

interface ServerEstateRequest {
  _id: string;
  userId: string;
  propertyType: string;
  location: string;
  budget: string;
  bedrooms?: string;
  bathrooms?: string;
  surface?: string;
  district?: string;
  additionalRequirements?: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

class RequestService {
  private convertServerRequest(serverRequest: ServerEstateRequest): EstateRequest {
    return {
      id: serverRequest._id,
      userId: serverRequest.userId,
      propertyType: serverRequest.propertyType,
      location: serverRequest.location,
      budget: serverRequest.budget,
      bedrooms: serverRequest.bedrooms,
      bathrooms: serverRequest.bathrooms,
      surface: serverRequest.surface,
      district: serverRequest.district,
      additionalRequirements: serverRequest.additionalRequirements,
      status: serverRequest.status,
      createdAt: serverRequest.createdAt,
    };
  }

  async getAllRequests(): Promise<EstateRequest[]> {
    const response = await api.get<{ requests: ServerEstateRequest[] }>(
      '/api/estate/requests'
    );
    return response.requests.map((req) => this.convertServerRequest(req));
  }

  async getRequestsByUser(_userId: string): Promise<EstateRequest[]> {
    const response = await api.get<{ requests: ServerEstateRequest[] }>(
      '/api/estate/my-requests'
    );
    return response.requests.map((req) => this.convertServerRequest(req));
  }

  async createRequest(
    _userId: string,
    requestData: Omit<EstateRequest, 'id' | 'userId' | 'status' | 'createdAt'>
  ): Promise<EstateRequest> {
    const response = await api.post<{ request: ServerEstateRequest }>(
      '/api/estate/requests',
      requestData
    );
    return this.convertServerRequest(response.request);
  }

  async getRequestById(requestId: string): Promise<EstateRequest> {
    const response = await api.get<{ request: ServerEstateRequest }>(
      `/api/estate/requests/${requestId}`
    );
    return this.convertServerRequest(response.request);
  }

  async updateRequestStatus(
    requestId: string,
    status: EstateRequest['status']
  ): Promise<EstateRequest> {
    const response = await api.patch<{ request: ServerEstateRequest }>(
      `/api/estate/requests/${requestId}/status`,
      { status }
    );
    return this.convertServerRequest(response.request);
  }
}

export const requestService = new RequestService();

