import api from "../api/axios";

export const getAllBloodRequests = async () => {
    const { data } = await api.get("/requests");
    return data;
};

export const getMyBloodRequests = async () => {
    const { data } = await api.get("/requests/my-requests");
    return data;
};

export const acceptBloodRequest = async (id) => {
    const { data } = await api.patch(`/requests/${id}/accept`);
    return data;
};

export const completeBloodRequest = async (id) => {
    const { data } = await api.patch(`/requests/${id}/complete`);
    return data;
};

export const getDonationHistory = async () => {
    const { data } = await api.get("/requests/donation-history");
    return data;
};