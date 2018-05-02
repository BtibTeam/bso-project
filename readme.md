# BSO-Project

**Building Semantic Ontology Project** is an open-source initiative aimed to ease the process of tagging realtime data in buildings. It is based on the open-source [Project Haystack](https://project-haystack.org/) which defines roughly 200 standard names and relations for describing building devices and points.

You can access directly the interface [bso-project.org](https://bso-project.org/#/ontology-creator)

## Goal
The goal of the project is to describe *what is* the data. We might call a point sometimes **_temperature_** or **_exhaust temperature_** or **_exhaust_temperature_**. Well, with BSO-Project, it will be **Ventilation** -> **AHU** -> **Duct Sensor** + **Exhausting** + **Measure** + **Temperature** + **Air**.

## Features
BSO-Project provides 3 main features on the top of it:

* A type based naming used to define all the elements. We call them Nodes. They represent abstract element (temperature, air etc.) or real devices. They can contain several tags.
* A structure which organizes all the Nodes through several graphs to easily find out the right Node 
* A translation mecanism, so the user uses its own language to do the tagging while keeping the standardised tags.

## Content
This repository contains the Website source code to build the namings, the relations, the translations etc. The Website is based on Angular 5. The content is stored in a Firestore database.

Any new feature is welcomed.