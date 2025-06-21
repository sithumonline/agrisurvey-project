# WOC7014 Group Project Report

*Project Title* : AgriSurvey <br>
*Framework* : Django, Next.js <br>
*Group Members* : Du Wentao (Matric Number), Wu Yilin (Matric Number), Li Fenyong (Matric Number), Hou Yujie (Matric Number), Bopitiyage Sithum Sandeepa Perera (24081446) <br>
*Project Description* : Lightweight web app for agricultural data collection which enables field enumerators to record farm details, crop info, samples, and pest reports. <br>


## Modules and Functions:

### 1. Auth and Dashboard

*Group Members* : Du Wentao (24084310)

**Authentication**

The Auth module handles user authentication, and the Dashboard module provides a comprehensive overview of agricultural survey data and an efficient operation portal.

The login interface is simple and intuitive, and users only need to enter their account number and password to quickly access the system.

![Login Screen](./screenshots/login.png)

**Dashboard**

AgriSurvey's dashboard is the user's core work platform. 

It displays assigned routes, surveyed farms, sample numbers, and pest and disease reports through intuitive cards and progress bars. 

The "Current Assignments" area uses a progress bar to clearly show the completion of tasks, while the "Alerts" section pushes emergency notifications in real time. 

The "Recent Activity" at the bottom dynamically records the latest operations.
![image](https://github.com/user-attachments/assets/25639e57-38f8-4cdf-b8bb-b3a64f18acfc)

The dashboard supports offline data sync by using indexDB, when browser has no internet connection, it will become offline mode:
![image](https://github.com/user-attachments/assets/1d42aacc-0b1f-478b-83bb-3c9d78c8ee7a)

If farm data already be loaded, survey can still continue, but submission will stored in local indexDB, after internet connection ready, user can manually sync offline data:

![image](https://github.com/user-attachments/assets/06efffc7-ef4f-4259-b596-c4248ef4923c)



### 2. Routes and Farms

*Group Members* : Li Fenyong (Matric Number)

**Routes**

The Route module clearly displays the key information of each route in the form of cards, including route name, status, completion progress, and assigned date. Users can view route details through "View Details" or create a new task through "Add New Route," fill in the name, status, and number of associated farms, and save.

![Route List](./screenshots/route_list.png)

![image](https://github.com/user-attachments/assets/5feed6b4-2067-4bba-8b4c-55c47a319378)

**Farms**

The Farm module allows you to browse all surveyed farms through a list. Each farm card displays key data such as the owner, area, crops planted, and last visit date, and supports "View Details" to view details. The module provides powerful search and filtering functions and also supports quick registration of new farms through "Add New Farm," filling in the name, owner, area, and associated routes, and saving.

![Farm List](./screenshots/farm_list.png)

![image](https://github.com/user-attachments/assets/a8660925-981a-4990-8805-b6dcafe2b04b)

![image](https://github.com/user-attachments/assets/8005f59e-9030-40f3-a8d1-725688c5b62d)

![image](https://github.com/user-attachments/assets/2aea5456-b0cf-4bd6-9876-0531c1bc29ad)

![image](https://github.com/user-attachments/assets/1f873ff0-cd5b-4f7d-8863-f7cf8794fc4b)

Corps in farm:

![image](https://github.com/user-attachments/assets/0350e735-1514-4819-b760-af4dc6384da2)

Samples in farm:

![image](https://github.com/user-attachments/assets/9b4809be-350a-4a43-91d0-941e35c05ffb)

Pests & diseases in farm:

![image](https://github.com/user-attachments/assets/8c4d3ea7-83a7-44ef-9517-da87532b289e)


### 3. Sampling

*Group Members* : Li Fenyong (Matric Number)

**Soil Sample**

The Soil Sample module can easily record detailed information about each soil sample, including the farm it belongs to, the date it was collected, pH value, moisture, and key nutrient content. The module supports adding new samples through a form, filling in farm, pH value, moisture, and nutrient data, and uploading sample photos and adding notes.

![Soil Sample](./screenshots/soil_sample.png)

![image](https://github.com/user-attachments/assets/c74fe8c9-7f94-4725-907c-7ed1703dbe1a)

**Water Sampling**

The Water Sample module can record core indicators such as sample source, test date, pH value, turbidity, etc., and supports uploading sample photos and adding observation notes. The module supports quick screening and detailed viewing. Through the "Add New Water Sample" function, users can efficiently complete the entry of water sampling data.

![Water Sample](./screenshots/water_sample.png)

![image](https://github.com/user-attachments/assets/528c1f28-a2a5-4134-a121-0832b7eb072f)

### 4. Pests & Diseases

*Group Members* : Hou Yujie (Matric Number)

The Pest & Disease module allows users to quickly report pest and disease incidents through a standardized form, including selecting key information such as the associated farm, category, name, and severity, and can upload on-site photos and detailed descriptions of symptoms. The system automatically generates timestamp records and displays historical reports in the form of visual cards, supporting filtering and sorting by farm, date, and severity. The full report can be viewed through "View Details."

![Pest/Disease Report](./screenshots/pest_report.png)

![image](https://github.com/user-attachments/assets/710ecff3-9371-4511-b211-df38f5bd7fad)

### 5. Reports

*Group Members* : Bopitiyage Sithum Sandeepa Perera (24081446)

The Report module is the data integration and output center of AgriSurvey, providing users with professional agricultural survey report generation functions. This module supports rapid location of target data through multi-dimensional screening and can generate comprehensive data reports covering farm information, soil/water sample records, and pest and disease reports with one click. The system clearly presents data in structured tables and supports CSV format export for further analysis or submission.

![image](https://github.com/user-attachments/assets/4abace24-c974-4c88-86d4-6674267853b5)

![image](https://github.com/user-attachments/assets/54f445ce-0fe8-4b87-b2a7-def6967e2cca)

