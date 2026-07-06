import api from "../api/axios";

export const getAdminStats = async () => {
    const { data } = await api.get("/admin/stats");
    return data;
};

export const getAllDonors = async (filters = {}) => {
    const { status = "", bloodGroup = "", district = "", search = "" } = filters;

    const { data } = await api.get("/admin/donors", {
        params: { status, bloodGroup, district, search },
    });

    return data;
};

export const verifyDonor = async (id) => {
    const { data } = await api.patch(`/admin/donors/${id}/verify`);
    return data;
};

export const rejectDonor = async (id, reason) => {
    const { data } = await api.patch(`/admin/donors/${id}/reject`, { reason });
    return data;
};

export const suspendDonor = async (id) => {
    const { data } = await api.patch(`/admin/donors/${id}/suspend`);
    return data;
};

export const deleteDonor = async (id) => {
    const { data } = await api.delete(`/admin/donors/${id}`);
    return data;
};

export const getAllRequests = async (filters = {}) => {
    const {
        status = "",
        bloodGroup = "",
        district = "",
        search = "",
    } = filters;

    const { data } = await api.get("/admin/requests", {
        params: {
            status,
            bloodGroup,
            district,
            search,
        },
    });

    return data;
};

export const updateRequestStatus = async (id, status) => {
    const { data } = await api.patch(
        `/admin/requests/${id}/status`,
        { status }
    );

    return data;
};

export const deleteRequest = async (id) => {
    const { data } = await api.delete(`/admin/requests/${id}`);

    return data;
};

export const getAllUsers = async (filters = {}) => {
    const {
        role = "",
        status = "",
        search = "",
    } = filters;

    const { data } = await api.get("/admin/users", {
        params: {
            role,
            status,
            search,
        },
    });

    return data;
};

export const updateUserStatus = async (id, accountStatus) => {
    const { data } = await api.patch(
        `/admin/users/${id}/status`,
        { accountStatus }
    );

    return data;
};

export const getActivityLogs = async () => {
    const { data } = await api.get("/admin/logs");
    return data;
};


// Latest 2 function added 
export const updateUserRole = async (id, role) => {
    const { data } = await api.patch(`/admin/users/${id}/role`, { role });
    return data;
};

export const deleteUser = async (id) => {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
};