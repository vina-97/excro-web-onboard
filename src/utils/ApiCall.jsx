import React from "react";
import axios from "axios";
import Constants from "./Constants";
import { getCookie } from ".";

// Status codes
const FORBIDDEN = 403;
const BADGATEWAY = 502;
const NOTFOUND = 404;
const ERROR = 422;
const MANYREQUESTS = 429;
const GETSWITCH = 0;
const POSTSWITCH = 1;
const PUTSWITCH = 2;
const PATCHSWITCH = 3;
const DELETESWITCH = 4;
const MAGICNUMBER_100 = 100;

class ApiCall extends React.Component {
  // Handles API errors and redirects/refresh as needed
  handleAuthorization = (callback, error) => {
    const responseData = error?.response?.data;

    if (error?.response?.status === ERROR) {
      callback(responseData);
    } else if (error?.response?.status === MANYREQUESTS) {
      callback(responseData);
    } else if (error?.response?.status === BADGATEWAY) {
      callback(responseData);
    } else if (error?.response?.status === FORBIDDEN) {
      window.location.href = "/access-forbidden";
    } else if (error?.response?.status === NOTFOUND) {
      callback({
        success: false,
        message: responseData?.message || "Resource not found",
      });
    } else {
      callback({
        success: false,
        message: responseData?.message || "Something went wrong",
      });
    }
  };

  get(url, callback) {
    this.createInstance(url, null, GETSWITCH)
      .then((result) => callback(result.data))
      .catch((error) => this.handleAuthorization(callback, error));
  }

  post(url, data, callback) {
    this.createInstance(url, data, POSTSWITCH)
      .then((result) => callback(result.data))
      .catch((error) => this.handleAuthorization(callback, error));
  }

  put(url, data, callback) {
    this.createInstance(url, data, PUTSWITCH)
      .then((result) => callback(result.data))
      .catch((error) => this.handleAuthorization(callback, error));
  }

  patch(url, data, callback) {
    this.createInstance(url, data, PATCHSWITCH)
      .then((result) => callback(result.data))
      .catch((error) => this.handleAuthorization(callback, error));
  }

  delete(url, data, callback) {
    this.createInstance(url, data, DELETESWITCH)
      .then((result) => callback(result.data))
      .catch((error) => this.handleAuthorization(callback, error));
  }

  // Standard API JSON instance creator
  createInstance(append, data, type) {
    console.log(getCookie("AdminWeb"), "getCookieApi");

    const instance = axios.create({
      baseURL: Constants.BASE_URL,
      headers: {
        Authorization: "Bearer " + getCookie(),
        withCredentials: true,
        credentials: "include",
      },
    });

    const url = append;
    switch (type) {
      case GETSWITCH:
        return instance.get(url);
      case POSTSWITCH:
        return instance.post(url, data);
      case PUTSWITCH:
        return instance.put(url, data);
      case PATCHSWITCH:
        return instance.patch(url, data);
      default:
        return instance.delete(url, { data });
    }
  }

  /**
   * Enhanced file upload with progress tracking
   * @param {string} url - API endpoint
   * @param {FormData} formData - FormData containing files
   * @param {function} progressCallback - Callback for upload progress (0-100)
   * @param {function} completionCallback - Callback when upload completes
   */
  upload(url, formData, progressCallback, completionCallback) {
    const config = {
      headers: {
        Authorization: "Bearer " + getCookie(),
        withCredentials: true,
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * MAGICNUMBER_100) / progressEvent.total,
        );
        if (progressCallback) {
          progressCallback(percentCompleted);
        }
      },
    };

    axios
      .post(Constants.BASE_URL + url, formData, config)
      .then((response) => {
        if (completionCallback) {
          completionCallback(response.data);
        }
      })
      .catch((error) => {
        this.handleAuthorization(completionCallback, error);
      });
  }

  /**
   * Upload multiple files with progress tracking
   * @param {string} url - API endpoint
   * @param {FormData} formData - FormData containing files
   * @param {function} progressCallback - Callback for upload progress (0-100)
   * @param {function} completionCallback - Callback when upload completes
   */
  uploadMultiple(
    url,
    files,
    fieldName = "files",
    progressCallback,
    completionCallback,
  ) {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`${fieldName}[${index}]`, file);
    });

    this.upload(url, formData, progressCallback, completionCallback);
  }

  // For direct Blob upload with explicit Content-Type
  uploadBlob(url, blob, contentType, progressCallback, completionCallback) {
    const config = {
      headers: { "Content-Type": contentType },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * MAGICNUMBER_100) / progressEvent.total,
        );
        if (progressCallback) {
          progressCallback(percentCompleted);
        }
      },
    };

    axios
      .post(Constants.BASE_URL + url, blob, config)
      .then((response) => {
        if (completionCallback) {
          completionCallback(response.data);
        }
      })
      .catch((error) => {
        this.handleAuthorization(completionCallback, error);
      });
  }

  render() {
    return null;
  }
}

export default new ApiCall();
