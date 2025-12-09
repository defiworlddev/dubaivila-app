import { api } from './api';
import { authService } from './authService';

export interface EstateRequest {
  id: string;
  userId: string;
  category: string;
  buyOrRent: string;
  budget: string;
  area: string;
  bed?: string;
  size?: string;
  additionalInfo?: string;
  status: 'New Request' | 'Receiving Offers' | 'Deal Closed 💯';
  createdAt: string;
  userPhoneNumber?: string;
  userName?: string;
}

interface ServerEstateRequest {
  _id: string;
  userId: string;
  category: string;
  buyOrRent: string;
  budget: string;
  area: string;
  bed?: string;
  size?: string;
  additionalInfo?: string;
  status: 'New Request' | 'Receiving Offers' | 'Deal Closed 💯';
  createdAt: string;
  userPhoneNumber?: string;
  userName?: string;
}

class RequestService {
  private convertServerRequest(serverRequest: ServerEstateRequest): EstateRequest {
    return {
      id: serverRequest._id,
      userId: serverRequest.userId,
      category: serverRequest.category,
      buyOrRent: serverRequest.buyOrRent,
      budget: serverRequest.budget,
      area: serverRequest.area,
      bed: serverRequest.bed,
      size: serverRequest.size,
      additionalInfo: serverRequest.additionalInfo,
      status: serverRequest.status,
      createdAt: serverRequest.createdAt,
      userPhoneNumber: serverRequest.userPhoneNumber,
      userName: serverRequest.userName,
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
    const user = authService.getCurrentUser();
    const isAgent = user?.isAgent;
    
    // Use public endpoint for non-authenticated users and regular users
    // Only use agent endpoint if user is authenticated and is an agent
    const endpoint = isAgent 
      ? `/api/agents/requests/${requestId}`
      : `/api/estate/requests/${requestId}`;
    
    const response = await api.get<{ request: ServerEstateRequest }>(endpoint);
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

